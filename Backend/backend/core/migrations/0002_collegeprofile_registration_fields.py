from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='collegeprofile',
            name='full_name',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='collegeprofile',
            name='aishe_code',
            field=models.CharField(default='', max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='collegeprofile',
            name='role',
            field=models.CharField(choices=[('principal', 'College Principal'), ('admin', 'DHE Admin'), ('committee', 'Screening Committee')], default='principal', max_length=20),
        ),
    ]