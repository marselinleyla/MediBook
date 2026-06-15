<h1 align="center">
  <img alt="logo" src="./FrontEnd/public/img/logo.png" width="224px"/><br/> <em>DocAppoint</em> Pour les Médecins pour Gérer les Rendez-vous des Patients
</h1>

---

<p align="center">

<a href="./LICENSE" >  
  <img alt="GitHub Language Count" src="https://img.shields.io/github/license/mouad-dadda/Doctors-Appointment-Management?style=for-the-badge&color=0085CA" />
</a>

  <img alt="GitHub Language Count" src="https://img.shields.io/github/languages/count/mouad-dadda/Doctors-Appointment-Management?style=for-the-badge&color=0033FF" />

  <img alt="GitHub Top Language" src="https://img.shields.io/github/languages/top/mouad-dadda/Doctors-Appointment-Management?style=for-the-badge&color=00ACC1" />

  <img alt="" src="https://img.shields.io/github/repo-size/mouad-dadda/Doctors-Appointment-Management?style=for-the-badge&color=1877F2" />

</p>

---

## 🌐 française

### Introduction
Bienvenue sur DocAppoint, une plateforme complète conçue pour simplifier la gestion des rendez-vous des patients. Ce projet permet aux médecins de s'inscrire, de gérer facilement leurs horaires et aux patients de prendre des rendez-vous en fonction des disponibilités.

---

### 🃏 Exécution locale

**⚡ Pré-requis**
- npm v8.15.0
- node v16.17.0
- composer v2.4.2
- php v8.1.4

**Étapes :**
1. Clonez le projet :
   ```bash
   git clone https://github.com/mouad-dadda/Doctors-Appointment-Management.git
   ```
2. Naviguez dans les dossiers backend et frontend, installez les dépendances et démarrez les serveurs.

Pour le frontend :
```bash
cd FrontEnd
npm install
npm start
```

Pour le backend :
- Créez votre base de données.
- Renommez `.env.example` en `.env` et configurez la connexion à votre base de données.

```bash
cd BackEnd
cp .env.example ./.env
php artisan key:generate
```

- Démarrez le serveur local :
```bash
composer install
php artisan serve
```

- Exécutez les migrations et les seeders pour des données d'exemple :
```bash
php artisan migrate --seed
```

---

### 💻 Fonctionnalités principales

- **Inscription des médecins :** Créez facilement des comptes en fournissant des détails professionnels et des identifiants.
- **Administrateur :** Vérifiez et activez les comptes des médecins.
- **Demandes de rendez-vous simplifiées :** Les médecins vérifiés gèrent les horaires ; les patients demandent des rendez-vous en fonction des disponibilités.
- **Tableau de bord complet :** Permet aux administrateurs de gérer les comptes des médecins, de vérifier les inscriptions et de surveiller l'activité de la plateforme.

---

### 🌙 Technologies

<p align="center">
    <img src="https://skillicons.dev/icons?i=laravel,react,redux,mysql,tailwind"  alt="Technologies" />
</p>

---

### 📃 Licence

Ce projet est sous licence [MIT License](./LICENSE).

---

### 📩 Contact

Pour toute question, n'hésitez pas à nous contacter via :
  <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"  alt="Gmail" />
  <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"  alt="Twitter" />

---

## 🌐 English

### Introduction
Welcome to DocAppoint, a comprehensive platform designed to simplify the management of patient appointments. This project facilitates doctors in registering, enabling them to easily manage their schedules, and allowing patients to book appointments based on availability.

---

### 🃏 Running Locally

**⚡ Prerequisites**
- npm v8.15.0
- node v16.17.0
- composer v2.4.2
- php v8.1.4

**Steps:**
1. Clone the project:
   ```bash
   git clone https://github.com/mouad-dadda/Doctors-Appointment-Management.git
   ```
2. Navigate to the backend and frontend folders, install dependencies, and start the servers.

For the frontend:
```bash
cd FrontEnd
npm install
npm start
```

For the backend:
- Create your database.
- Rename `.env.example` to `.env` and set up your database connection.

```bash
cd BackEnd
cp .env.example ./.env
php artisan key:generate
```

- Start the local server:
```bash
composer install
php artisan serve
```

- Run migrations and seeders for sample data:
```bash
php artisan migrate --seed
```

---

### 💻 Key Features

- **Doctor Registration:** Effortlessly create accounts by providing professional details and credentials.
- **Administrator:** Verify and activate doctor accounts.
- **Seamless Appointment Requests:** Verified doctors manage schedules; patients request appointments based on availability.
- **Comprehensive Dashboard:** Empower administrators to manage doctor accounts, verify registrations, and monitor platform activity.

---

### 🌙 Technologies

<p align="center">
    <img src="https://skillicons.dev/icons?i=laravel,react,redux,mysql,tailwind"  alt="Technologies" />
</p>

---

### 📃 License

This project is licensed under the [MIT License](./LICENSE).

---

### 📩 Contact

For inquiries, feel free to reach out via:
  <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"  alt="Gmail" />
  <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"  alt="Twitter" />
