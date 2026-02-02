# EduLearn - Frontend Étudiant

Application frontend React/Next.js pour la plateforme e-learning EduLearn.

## 🚀 Technologies

- **Next.js 16** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **TailwindCSS 4** - Framework CSS utilitaire
- **Axios** - Client HTTP avec intercepteurs JWT
- **Lucide React** - Icônes

## 📁 Structure du Projet

```
├── app/                          # App Router Next.js
│   ├── (auth)/                   # Routes d'authentification
│   │   ├── login/                # Page de connexion
│   │   └── layout.tsx
│   ├── (student)/                # Routes protégées étudiant
│   │   ├── courses/              # Liste et détail des cours
│   │   ├── quiz/                 # Passage des QCM
│   │   ├── my-results/           # Historique des résultats
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Page d'accueil
├── components/                   # Composants réutilisables
│   ├── ui/                       # Composants UI génériques
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Loader.tsx
│   │   ├── ProgressBar.tsx
│   │   └── index.ts
│   ├── layout/                   # Composants de layout
│   │   └── Navbar.tsx
│   ├── courses/                  # Composants liés aux cours
│   │   ├── CourseCard.tsx
│   │   └── CourseList.tsx
│   ├── course-detail/            # Composants détail cours
│   │   ├── VideoPlayer.tsx
│   │   ├── DocumentViewer.tsx
│   │   └── QuizCard.tsx
│   └── quiz/                     # Composants QCM
│       └── QuizQuestion.tsx
├── lib/                          # Logique métier
│   ├── api/                      # Services API
│   │   ├── axios.ts              # Configuration Axios + JWT
│   │   ├── auth.ts               # API authentification
│   │   ├── courses.ts            # API cours
│   │   ├── quiz.ts               # API QCM
│   │   └── index.ts
│   ├── context/                  # Contextes React
│   │   └── AuthContext.tsx       # Gestion authentification
│   ├── hooks/                    # Hooks personnalisés
│   │   ├── useCourses.ts
│   │   ├── useQuiz.ts
│   │   └── index.ts
│   └── types/                    # Types TypeScript
│       └── index.ts
└── public/                       # Assets statiques
```

## 🔧 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## ⚙️ Configuration

Le fichier `.env.local` est déjà configuré :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification :

1. L'utilisateur se connecte via `/login`
2. Le token JWT est stocké dans `localStorage`
3. Axios intercepte toutes les requêtes pour ajouter le header `Authorization: Bearer <token>`
4. En cas de token expiré (401), l'utilisateur est redirigé vers `/login`

## 📱 Pages Disponibles

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil publique |
| `/login` | Connexion utilisateur |
| `/courses` | Liste des cours (protégée) |
| `/courses/[id]` | Détail d'un cours avec vidéos, docs et QCM |
| `/quiz/[id]` | Passage d'un QCM |
| `/my-results` | Historique des résultats de QCM |

## 🔌 API Endpoints Utilisés

L'application communique avec le backend Symfony via ces endpoints :

### Authentification
- `POST /api/login` - Connexion
- `POST /api/register` - Inscription
- `GET /api/me` - Utilisateur courant

### Cours
- `GET /api/courses` - Liste des cours
- `GET /api/courses/{id}` - Détail d'un cours (avec videos, documents, quizzes)

### QCM
- `GET /api/quizzes/{id}` - Détail d'un QCM avec questions et choix
- `POST /api/quiz-attempts` - Soumettre une tentative
- `GET /api/quiz-attempts/me` - Historique des tentatives

## 📝 Scripts NPM

```bash
npm run dev      # Serveur de développement (http://localhost:3000)
npm run build    # Build de production
npm run start    # Lancer le build de production
npm run lint     # Vérification ESLint
```

## 🏗️ Architecture

L'architecture suit les bonnes pratiques React/Next.js :

- **Séparation des responsabilités** : API, hooks, composants, pages
- **Composants réutilisables** : UI atomique (Button, Card, Input)
- **Hooks personnalisés** : Logique métier encapsulée (useCourses, useQuiz)
- **Contexte d'authentification** : État global pour l'auth
- **Types TypeScript** : Typage fort synchronisé avec l'API backend
- **Intercepteurs Axios** : Gestion automatique du token JWT

## 📄 License

Projet académique - BUT 3 Développement Avancé
