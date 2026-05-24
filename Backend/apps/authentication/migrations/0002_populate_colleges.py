from django.db import migrations

def populate_colleges(apps, schema_editor):
    College = apps.get_model('authentication', 'College')
    colleges_data = [
        {"name": "Government College, Sector 14, Gurugram", "aishe_code": "C-23456"},
        {"name": "Government College, Sector 9, Ambala", "aishe_code": "C-12345"},
        {"name": "Government College for Girls, Sector 14, Panchkula", "aishe_code": "C-34567"},
        {"name": "Kurukshetra University, Kurukshetra", "aishe_code": "U-0123"},
        {"name": "Dyal Singh College, Karnal", "aishe_code": "C-45678"},
        {"name": "Government College, Sector 1, Panchkula", "aishe_code": "C-56789"},
    ]
    for college_info in colleges_data:
        College.objects.get_or_create(
            aishe_code=college_info['aishe_code'],
            defaults={'name': college_info['name']}
        )

def unload_colleges(apps, schema_editor):
    College = apps.get_model('authentication', 'College')
    College.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(populate_colleges, unload_colleges),
    ]
