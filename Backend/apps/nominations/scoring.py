AWARD_THRESHOLDS = [
    {
        "level": "Silver",
        "min_score": 51,
        "description": "Recognized for meeting key quality indicators across the nomination framework.",
        "badge_color": "silver"
    },
    {
        "level": "Gold",
        "min_score": 75,
        "description": "Exemplary implementation of institutional governance and core values.",
        "badge_color": "gold"
    },
    {
        "level": "Platinum",
        "min_score": 91,
        "description": "Outstanding leadership and state-level benchmarking in higher education.",
        "badge_color": "platinum"
    }
]

def calculate_nomination_score(answers):
    score = 0
    
    # 1. Two Simultaneous Academic Programmes (Max 4)
    ans1 = answers.get('indicator_1', {})
    if ans1.get('value') == 'Yes':
        score += 4
        
    # 2. Internship/Apprenticeship Embedded Degree Programmes (Max 4)
    ans2 = answers.get('indicator_2', {})
    if ans2.get('value') == 'Yes':
        score += 4
        
    # 3. Courses Offered in Indian Languages (Max 4)
    ans3 = answers.get('indicator_3', {})
    if ans3.get('value') == 'Yes':
        items = ans3.get('items', [])
        score += min(len(items), 4)
        
    # 4. Special Programmes in IKS (Max 4)
    ans4 = answers.get('indicator_4', {})
    if ans4.get('value') == 'Yes':
        items = ans4.get('items', [])
        score += min(len(items), 4)
        
    # 5. Institutional Development Plan (IDP) Developed (Max 6)
    ans5 = answers.get('indicator_5', {})
    if ans5.get('value') == 'Yes':
        score += 6
        
    # 6. Appointment of Ombudsperson (Max 2)
    ans6 = answers.get('indicator_6', {})
    if ans6.get('value') == 'Yes':
        score += 2
        
    # 7. NAAC Accreditation Status (Max 8)
    ans7 = answers.get('indicator_7', {})
    grade = ans7.get('value', 'Not Accredited')
    grade_scores = {
        'A++': 8,
        'A+': 6,
        'A': 4,
        'B+': 3,
        'B': 2,
        'C': 2,
        'Not Accredited': 0
    }
    score += grade_scores.get(grade, 0)
    
    # 8. Adoption of National Credit Framework (NCrF) (Max 2)
    ans8 = answers.get('indicator_8', {})
    if ans8.get('value') == 'Yes':
        score += 2
        
    # 9. Academic Bank of Credits (ABC) Registered Students (Max 8)
    ans9 = answers.get('indicator_9', {})
    if ans9.get('value') == 'Yes':
        try:
            pct = float(ans9.get('percentage', 0))
        except (ValueError, TypeError):
            pct = 0
        if pct > 75:
            score += 8
        elif pct > 50:
            score += 6
        elif pct > 25:
            score += 4
        elif pct > 0:
            score += 2
            
    # 10. Annual Update on AISHE Portal (Max 4)
    ans10 = answers.get('indicator_10', {})
    if ans10.get('value') == 'Yes':
        score += 4
        
    # 11. Professor of Practice Appointed (Max 4)
    ans11 = answers.get('indicator_11', {})
    if ans11.get('value') == 'Yes':
        items = ans11.get('items', [])
        score += min(len(items) * 2, 4)
        
    # 12. Incubation/Startup Cell Functional (Max 6)
    ans12 = answers.get('indicator_12', {})
    if ans12.get('value') == 'Yes':
        try:
            count = int(ans12.get('count', 0))
        except (ValueError, TypeError):
            count = 0
        if count > 10:
            score += 6
        elif count >= 6:
            score += 4
        elif count >= 1:
            score += 2
            
    # 13. National Innovation and Start-up Policy Implemented (Max 4)
    ans13 = answers.get('indicator_13', {})
    if ans13.get('value') == 'Yes':
        score += 4
        
    # 14. Academic/Research Collaboration with Foreign HEIs (Max 6)
    ans14 = answers.get('indicator_14', {})
    if ans14.get('value') == 'Yes':
        items = ans14.get('items', [])
        score += min(len(items), 6)
        
    # 15. Alumni Connect Cell Functional (Max 6)
    ans15 = answers.get('indicator_15', {})
    if ans15.get('value') == 'Yes':
        items = ans15.get('items', [])
        score += min(len(items), 6)
        
    # 16. Gender Parity Initiatives (Max 6)
    ans16 = answers.get('indicator_16', {})
    if ans16.get('value') == 'Yes':
        items = ans16.get('items', [])
        score += min(len(items), 6)
        
    # 17. Psychological and Emotional Well-Being Programmes (Max 6)
    ans17 = answers.get('indicator_17', {})
    if ans17.get('value') == 'Yes':
        items = ans17.get('items', [])
        score += min(len(items), 6)
        
    # 18. Implementation of UGC Guidelines on Student Welfare & Fitness (Max 6)
    ans18 = answers.get('indicator_18', {})
    if ans18.get('value') == 'Yes':
        items = ans18.get('items', [])
        score += min(len(items), 6)
        
    # 19. Provision for Online Courses / MOOCs Policy (Max 4)
    ans19 = answers.get('indicator_19', {})
    if ans19.get('value') == 'Yes':
        score += 4
        
    # 20. Teachers Trained & Certified under MMTTC (Max 6)
    ans20 = answers.get('indicator_20', {})
    try:
        pct = float(ans20.get('percentage', 0))
    except (ValueError, TypeError):
        pct = 0
    if pct > 75:
        score += 6
    elif pct > 50:
        score += 4
    elif pct > 0:
        score += 2
        
    # Determine category dynamically from AWARD_THRESHOLDS
    category = "No Award"
    for threshold in sorted(AWARD_THRESHOLDS, key=lambda x: x["min_score"], reverse=True):
        if score >= threshold["min_score"]:
            category = threshold["level"]
            break
        
    return score, category
