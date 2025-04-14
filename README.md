```markdown
## Installation du projet

### Prérequis

Assurez-vous d'avoir installé sur votre machine :

- [Node.js](https://nodejs.org/) (recommandé : version LTS)
- [.NET 7 SDK ou supérieur](https://dotnet.microsoft.com/en-us/download)

---

### Étapes d'installation

1. Clonez le dépôt :

```bash
git clone https://github.com/franssoua/PII.git
cd PII
```

2. Installez et lancez le frontend :

```bash
cd cinemv-front
npm install
npm run start
```

3. Ouvrez un **autre terminal** pour démarrer le backend :

```bash
cd cinemvBack
dotnet restore
dotnet run
```

> Le démarrage peut prendre un peu de temps, c’est tout à fait normal.

---

L’application sera disponible à :
- **Frontend** : [http://localhost:5173](http://localhost:5173)
- **Backend (API)** : [http://localhost:5180](http://localhost:5180/swagger)
```