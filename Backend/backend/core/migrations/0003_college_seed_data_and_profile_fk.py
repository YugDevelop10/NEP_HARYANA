from django.db import migrations, models


def create_sample_colleges(apps, schema_editor):
	College = apps.get_model('core', 'College')
	College.objects.bulk_create([
		College(name='Government College, Gurugram', aishe_code='AISHE-HR-GGN-001'),
		College(name='Government College, Hisar', aishe_code='AISHE-HR-HSR-002'),
		College(name='Maharshi Dayanand College, Rohtak', aishe_code='AISHE-HR-RTK-003'),
		College(name='Panchkula Degree College', aishe_code='AISHE-HR-PKL-004'),
		College(name='Bhiwani Institute of Higher Learning', aishe_code='AISHE-HR-BWN-005'),
	])


def delete_sample_colleges(apps, schema_editor):
	College = apps.get_model('core', 'College')
	College.objects.filter(aishe_code__in=[
		'AISHE-HR-GGN-001',
		'AISHE-HR-HSR-002',
		'AISHE-HR-RTK-003',
		'AISHE-HR-PKL-004',
		'AISHE-HR-BWN-005',
	]).delete()


class Migration(migrations.Migration):

	dependencies = [
		('core', '0002_collegeprofile_registration_fields'),
	]

	operations = [
		migrations.CreateModel(
			name='College',
			fields=[
				('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
				('name', models.CharField(max_length=255, unique=True)),
				('aishe_code', models.CharField(max_length=30, unique=True)),
				('is_active', models.BooleanField(default=True)),
				('created_at', models.DateTimeField(auto_now_add=True)),
			],
		),
		migrations.AddField(
			model_name='collegeprofile',
			name='college',
			field=models.ForeignKey(blank=True, null=True, on_delete=models.deletion.PROTECT, related_name='profiles', to='core.college'),
		),
		migrations.RunPython(create_sample_colleges, delete_sample_colleges),
	]