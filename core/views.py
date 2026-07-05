from django.shortcuts import render
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from .models import Skill, Project, Service, ContactMessage, VisitorCount, Resume
from .serializers import SkillSerializer, ProjectSerializer, ServiceSerializer, ContactMessageSerializer


# ── HOME PAGE ──
def home(request):
    """Home page - returns API status"""
    return JsonResponse({
        'message': 'Welcome to Muhammad Danish Portfolio API',
        'version': '1.0',
        'endpoints': {
            'skills': '/api/skills/',
            'projects': '/api/projects/',
            'services': '/api/services/',
            'contact': '/api/contact/',
            'portfolio_data': '/api/portfolio-data/',
            'visitor_count': '/api/visitors/',
            'resume_download': '/api/resume/download/',
        },
        'admin': '/admin/',
    })


# ── DRF ViewSets ──
class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.filter(is_active=True)
    serializer_class = SkillSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer


# ── CONTACT FORM API ──
@api_view(['POST'])
def contact_api(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Message received — I will respond within 24 hours.'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── PORTFOLIO DATA API ──
@api_view(['GET'])
def portfolio_data(request):
    skills = Skill.objects.filter(is_active=True)
    projects = Project.objects.filter(is_active=True)
    services = Service.objects.filter(is_active=True)
    data = {
        'skills': SkillSerializer(skills, many=True).data,
        'projects': ProjectSerializer(projects, many=True).data,
        'services': ServiceSerializer(services, many=True).data,
    }
    return Response(data)


# ── 1. CONTACT FORM (JSON API) ──
@csrf_exempt
@require_POST
def contact_json(request):
    try:
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', 'No Subject').strip()
        message = data.get('message', '').strip()

        if not all([name, email, message]):
            return JsonResponse({'success': False, 'error': 'Name, email, and message are required!'}, status=400)

        ContactMessage.objects.create(name=name, email=email, subject=subject, message=message)
        return JsonResponse({'success': True, 'message': 'Message received successfully!'})

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


# ── 2. PROJECTS API ──
@require_GET
def projects_api(request):
    projects = Project.objects.filter(is_active=True)
    data = []
    for p in projects:
        data.append({
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'image': request.build_absolute_uri(p.image.url) if p.image else None,
            'tech_list': p.get_tech_list(),
            'github_link': p.github_link,
            'live_link': p.live_link,
            'tag': p.tag,
        })
    return JsonResponse({'projects': data})


# ── 4. SKILLS API ──
@require_GET
def skills_api(request):
    skills = Skill.objects.filter(is_active=True)
    data = [{'name': s.name, 'percentage': s.percentage} for s in skills]
    return JsonResponse({'skills': data})


# ── 5. VISITOR COUNTER API ──
@require_GET
def visitor_count_api(request):
    counter, _ = VisitorCount.objects.get_or_create(id=1)
    counter.count += 1
    counter.save()
    return JsonResponse({'count': counter.count})


# ── 6. RESUME DOWNLOAD ──
@require_GET
def download_resume(request):
    try:
        resume = Resume.objects.latest('uploaded_at')
        response = FileResponse(resume.file.open('rb'), as_attachment=True)
        response['Content-Disposition'] = 'attachment; filename="Muhammad_Danish_Resume.pdf"'
        return response
    except Resume.DoesNotExist:
        return JsonResponse({'error': 'No resume uploaded yet'}, status=404)
