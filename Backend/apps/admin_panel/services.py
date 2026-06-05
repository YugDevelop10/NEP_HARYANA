from datetime import timedelta
from django.utils import timezone
from apps.authentication.models import College, User
from apps.nominations.models import Nomination
from apps.nominations.scoring import get_individual_indicator_scores

def get_all_applications():
    nominations = Nomination.objects.all().order_by("-updated_at")
    apps = []
    for nom in nominations:
        status_str = nom.status or ("Pending Review" if nom.is_submitted else "Draft")
            
        apps.append({
            "id": nom.id,
            "college_id": nom.college.id,
            "college_name": nom.college.name,
            "aishe_code": nom.college.aishe_code,
            "score": nom.score,
            "award_category": nom.award_category,
            "is_submitted": nom.is_submitted,
            "status": status_str,
            "updated_at": nom.updated_at.strftime("%Y-%m-%d %H:%M") if nom.updated_at else None,
            "submitted_at": nom.submitted_at.strftime("%Y-%m-%d %H:%M") if nom.submitted_at else None,
        })
    return apps

def get_institutions_summary():
    colleges = College.objects.all().order_by("name")
    institutions = []

    for college in colleges:
        nom = Nomination.objects.filter(college=college).first()
        has_app = nom is not None
        is_sub = nom.is_submitted if has_app else False
        
        status_str = "not_started"
        score = 0
        award = "No Award"
        remarks_str = ""
        history_list = []
        
        # Derive type from nomination or default to Govt
        college_type = "Govt"
        district = "Haryana"
        
        if has_app:
            score = nom.score
            award = nom.award_category
            remarks_str = nom.remarks or ""
            history_list = nom.history or []
            
            # Map type
            inst_type = str(nom.institution_type or "").lower()
            if "aided" in inst_type:
                college_type = "Aided"
            elif "private" in inst_type:
                college_type = "Private"
            else:
                college_type = "Govt"
                
            # Parse district from address or name
            address_str = str(nom.address or "").lower()
            name_str = college.name.lower()
            for dist in ["rohtak", "panchkula", "ambala", "karnal", "gurugram", "hisar", "panipat", "kurukshetra", "faridabad", "yamunanagar", "sonipat", "kaithal"]:
                if dist in address_str or dist in name_str:
                    district = dist.capitalize()
                    break

            status_str = nom.status or ("Pending Review" if nom.is_submitted else "Draft")

        # Map parameter IDs to corresponding indicator evidence URLs
        docs_dict = {}
        if has_app:
            answers = nom.answers or {}
            param_to_indicator_map = {
                "p1": "indicator_2",
                "p2": "indicator_3",
                "p3": "indicator_4",
                "p4": "indicator_5",
                "p5": "indicator_7",
                "p6": "indicator_9",
                "p7": "indicator_11",
                "p8": "indicator_12",
                "p9": "indicator_14",
                "p10": "indicator_15",
                "p11": "indicator_16",
                "p12": "indicator_18",
                "p13": "indicator_19",
                "p14": "indicator_20",
                "p15": "indicator_1",
                "p16": "indicator_6",
                "p17": "indicator_8",
                "p18": "indicator_10",
                "p19": "indicator_13",
                "p20": "indicator_17"
            }
            for param_id, ind_key in param_to_indicator_map.items():
                ind_data = answers.get(ind_key, {})
                url = ind_data.get("evidence_url")
                if url:
                    docs_dict[param_id] = url
        else:
            docs_dict = {f"p{i}": "" for i in range(1, 21)}

        institutions.append(
            {
                "id": str(college.id),
                "college_id": college.id,
                "docs": docs_dict,
                "name": college.name,
                "aishe": college.aishe_code,
                "aishe_code": college.aishe_code,
                "type": college_type,
                "district": district,
                "has_application": has_app,
                "application_status": status_str,
                "status": status_str,
                "is_submitted": is_sub,
                "score": score,
                "scores": (
                    nom.reviewer_scores if (has_app and nom.reviewer_scores) else
                    get_individual_indicator_scores(nom.answers or {}) 
                    if has_app else 
                    {f"p{i}": 0 for i in range(1, 23)}
                ),
                "remarks": remarks_str,
                "history": history_list,
                "grand_total": score,
                "award_category": award,
                "classification": {
                    "name": award,
                    "color": "#7C3AED" if award == "Platinum" else "#D97706" if award == "Gold" else "#6B7280" if award == "Silver" else "#EF4444",
                    "bg": "bg-purple-100 text-purple-800 border-purple-300" if award == "Platinum" else "bg-amber-100 text-amber-800 border-amber-300" if award == "Gold" else "bg-slate-100 text-slate-800 border-slate-300" if award == "Silver" else "bg-red-100 text-red-800 border-red-300"
                },
                "updated_at": nom.updated_at.strftime("%Y-%m-%d %H:%M") if (has_app and nom.updated_at) else None,
            }
        )
    return institutions

def get_dashboard_stats():
    total_colleges = College.objects.count()
    registered_principals = User.objects.filter(role="principal").count()
    
    total_nominations = Nomination.objects.count()
    submitted_nominations = Nomination.objects.filter(is_submitted=True).count()
    
    approved_awards = 0
    pending_review = 0
    sent_back = 0
    rejected = 0
    
    colleges = get_institutions_summary()
    for col in colleges:
        status_str = col["status"]
        if status_str == "Approved":
            approved_awards += 1
        elif status_str == "Pending Review":
            pending_review += 1
        elif status_str == "Sent Back":
            sent_back += 1
        elif status_str == "Rejected":
            rejected += 1
            
    return {
        "total_colleges": total_colleges,
        "total_applications": total_nominations,
        "submitted_applications": submitted_nominations,
        "in_progress_applications": total_nominations - submitted_nominations,
        "approved_awards": approved_awards,
        "pending_review": pending_review,
        "sent_back": sent_back,
        "rejected": rejected,
        "registered_principals": registered_principals,
        "average_score_percentage": None,
        "award_distribution": {
            "Platinum": Nomination.objects.filter(award_category="Platinum").count(),
            "Gold": Nomination.objects.filter(award_category="Gold").count(),
            "Silver": Nomination.objects.filter(award_category="Silver").count(),
            "No Award": Nomination.objects.filter(award_category="No Award").count(),
        },
    }

def get_analytics():
    stats = get_dashboard_stats()
    now = timezone.now()

    trend_buckets = {}
    for i in range(5, -1, -1):
        month_start = (now.replace(day=1) - timedelta(days=30 * i)).replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )
        key = month_start.strftime("%Y-%m")
        trend_buckets[key] = 0

    submission_trend = [
        {"month": month, "count": count} for month, count in sorted(trend_buckets.items())
    ]

    return {
        "stats": stats,
        "institution_counts": [],
        "score_distribution": [],
        "status_breakdown": [
            {"status": "submitted", "count": stats["submitted_applications"]},
            {"status": "in_progress", "count": stats["in_progress_applications"]},
            {"status": "approved", "count": stats["approved_awards"]},
            {"status": "pending_review", "count": stats["pending_review"]},
        ],
        "submission_trend": submission_trend,
        "recent_activity": [],
        "top_institutions": [],
        "award_distribution": stats["award_distribution"],
    }
