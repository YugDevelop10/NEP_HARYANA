from django.db import migrations

def populate_additional_colleges(apps, schema_editor):
    College = apps.get_model('authentication', 'College')
    colleges_data = [
        {"name": "Government College, Sector 14, Gurugram", "aishe_code": "C-23456"},
        {"name": "Government College, Sector 9, Ambala", "aishe_code": "C-12345"},
        {"name": "Government College for Girls, Sector 14, Panchkula", "aishe_code": "C-34567"},
        {"name": "Kurukshetra University, Kurukshetra", "aishe_code": "U-0123"},
        {"name": "Dyal Singh College, Karnal", "aishe_code": "C-45678"},
        {"name": "Government College, Sector 1, Panchkula", "aishe_code": "C-56789"},
        {"name": "Pandit Neki Ram Sharma Government College, Rohtak", "aishe_code": "C-67890"},
        {"name": "Government Post Graduate College, Hisar", "aishe_code": "C-78901"},
        {"name": "Hindu College, Sonepat", "aishe_code": "C-89012"},
        {"name": "Government College, Faridabad", "aishe_code": "C-90123"},
    ]
    for college_info in colleges_data:
        # Using update_or_create to ensure the names are correct even if they were default previously
        College.objects.update_or_create(
            aishe_code=college_info['aishe_code'],
            defaults={'name': college_info['name']}
        )

def unload_additional_colleges(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_refreshtoken'),
    ]

    operations = [
        migrations.RunPython(populate_additional_colleges, unload_additional_colleges),
    ]
