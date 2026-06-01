"""
Seed initial : 7 utilisateurs + photos des locaux.
Note : photos via Unsplash (libres de droit) — placeholders pour ce lab.
Pour un déploiement réel SG, remplacer par les vraies photos avec autorisation.
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.models.photo import Photo


USERS_SEED = [
    {
        "username": "alice",
        "password": "alice2026",
        "full_name": "Alice Dupont",
        "role": "Manager",
        "department": "Innovation & Technology",
        "entreprise": "Société Générale",
        "email": "alice.dupont@socgen.com",
        "bio": "15 ans d'expérience en management d'équipes IT. Passionnée par la transformation digitale.",
        "avatar_url": "https://i.pravatar.cc/200?img=44",
    },
    {
        "username": "ali",
        "password": "ali2026",
        "full_name": "Ali Benali",
        "role": "DevOps Engineer",
        "department": "Plateformes Cloud",
        "entreprise": "Société Générale",
        "email": "ali.benali@socgen.com",
        "bio": "Expert Kubernetes & Terraform. Architecte des pipelines CI/CD.",
        "avatar_url": "https://i.pravatar.cc/200?img=12",
    },
  {
    "username": "walker",
    "password": "walker2026",
    "full_name": "walker ulrich",
    "role": "Alternant DevSecOps",
    "department": "Sécurité Opérationnelle",
    "entreprise": "Société Générale",
    "email": "walker.ulrich@socgen.com",
    "bio": "Alternant Bac+5 EFREI Paris. Focus sur l'intégration sécurité dans les pipelines.",
    "avatar_url": "/images/photo1.jpg",
      },
    {
        "username": "sophie",
        "password": "sophie2026",
        "full_name": "Sophie Laurent",
        "role": "Architecte Cloud",
        "department": "Plateformes Cloud",
        "entreprise": "Société Générale",
        "email": "sophie.laurent@socgen.com",
        "bio": "Architecte AWS & Azure certifiée. Lead de la migration cloud des services bancaires.",
        "avatar_url": "https://i.pravatar.cc/200?img=47",
    },
    {
        "username": "marc",
        "password": "marc2026",
        "full_name": "Marc Dubois",
        "role": "Lead Developer",
        "department": "Banque de Détail",
        "entreprise": "Société Générale",
        "email": "marc.dubois@socgen.com",
        "bio": "Lead Java / Spring Boot. 12 ans à la Société Générale.",
        "avatar_url": "https://i.pravatar.cc/200?img=33",
    },
    {
        "username": "emma",
        "password": "emma2026",
        "full_name": "Emma Bernard",
        "role": "Product Owner",
        "department": "Digital Banking",
        "entreprise": "Société Générale",
        "email": "emma.bernard@socgen.com",
        "bio": "PO de l'application mobile SG. Adepte des méthodologies agiles.",
        "avatar_url": "https://i.pravatar.cc/200?img=45",
    },
    {
        "username": "thomas",
        "password": "thomas2026",
        "full_name": "Thomas Petit",
        "role": "Site Reliability Engineer",
        "department": "Production & SRE",
        "entreprise": "Société Générale",
        "email": "thomas.petit@socgen.com",
        "bio": "Garant de la disponibilité 24/7 des services. Expert Prometheus / Grafana.",
        "avatar_url": "https://i.pravatar.cc/200?img=15",
    },
]


PHOTOS_SEED = [
    {
        "title": "Tour Société Générale - La Défense",
        "description": "Le siège emblématique de La Défense, architecture moderne aux lignes audacieuses.",
        "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
        "category": "batiment",
        "location": "La Défense, Paris",
    },
    {
        "title": "Open space collaboratif",
        "description": "Nos équipes Tech travaillent dans des espaces ouverts favorisant l'échange et la créativité.",
        "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
        "category": "bureau",
        "location": "Étage 12 - Plateforme Cloud",
    },
    {
        "title": "Réunion stratégique",
        "description": "Brainstorming entre équipes produit et tech autour des prochaines évolutions.",
        "image_url": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
        "category": "reunion",
        "location": "Salle Innovation",
    },
    {
        "title": "Pause café entre collègues",
        "description": "Moments d'échange informels qui font la richesse de notre culture d'entreprise.",
        "image_url": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80",
        "category": "ambiance",
        "location": "Espace détente",
    },
    {
        "title": "Pair programming",
        "description": "Deux développeurs collaborent sur une nouvelle fonctionnalité de l'app mobile.",
        "image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
        "category": "bureau",
        "location": "Lab Innovation",
    },
    {
        "title": "Auditorium - Conférences internes",
        "description": "Nos conférences mensuelles sur les nouvelles technologies attirent toujours du monde.",
        "image_url": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80",
        "category": "evenement",
        "location": "Auditorium SG",
    },
    {
        "title": "Salle de créativité",
        "description": "Espace dédié au design thinking, avec tableaux blancs et matériel pour les ateliers.",
        "image_url": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80",
        "category": "bureau",
        "location": "Design Lab",
    },
    {
        "title": "Cafétéria d'entreprise",
        "description": "Notre cafétéria accueille les collaborateurs pour des déjeuners conviviaux.",
        "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
        "category": "ambiance",
        "location": "Rez-de-chaussée",
    },
    {
        "title": "Hackathon interne",
        "description": "Les équipes Tech relèvent des défis 48h non-stop. Innovation, energy et team building.",
        "image_url": "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1200&q=80",
        "category": "evenement",
        "location": "Forum SG",
    },
    {
        "title": "Vue depuis les bureaux",
        "description": "Vue panoramique sur Paris depuis les étages élevés de la tour SG.",
        "image_url": "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=1200&q=80",
        "category": "batiment",
        "location": "Étage 35",
    },
    {
        "title": "Salle de monitoring",
        "description": "Le NOC où nos SRE surveillent la production 24/7.",
        "image_url": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
        "category": "bureau",
        "location": "NOC - Production",
    },
    {
        "title": "Cérémonie remise diplômes alternants",
        "description": "Chaque année, nous célébrons nos alternants qui rejoignent la grande famille SG.",
        "image_url": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80",
        "category": "evenement",
        "location": "Grand Salon",
    },
]


async def seed_data(db: AsyncSession):
    """Charge les utilisateurs et photos si la BDD est vide."""
    # Check si déjà seedé
    result = await db.execute(select(User))
    if result.scalars().first() is not None:
        return

    # Insertion utilisateurs
    for user_data in USERS_SEED:
        user = User(**user_data)
        db.add(user)

    # Insertion photos
    for photo_data in PHOTOS_SEED:
        photo = Photo(**photo_data)
        db.add(photo)

    await db.commit()
    print(f"✓ Seed terminé : {len(USERS_SEED)} utilisateurs, {len(PHOTOS_SEED)} photos")
