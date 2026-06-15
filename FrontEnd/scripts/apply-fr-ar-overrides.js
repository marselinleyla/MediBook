// Override script — applies specific French and Arabic translated values
// on top of the English-derived locale files. This is the authoritative translation source for non-English locales.
const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "../public/locales");

const frOverrides = {
  doctor: {
    welcome_doctor: "Bienvenue",
    in_MediBook: "sur MediBook",
    appointments_today: "Vous avez des rendez-vous prévus aujourd'hui !",
    appointments: "Rendez-vous",
    history: "Historique",
    settings: "Paramètres",
    dashboard_overview: "Aperçu du tableau de bord",
    account_settings: "Paramètres du compte",
    logout: "Déconnexion",
    todays_schedule: "Planning du jour",
    incoming_appointments: "Rendez-vous entrants",
    completed: "Terminé",
    cancel: "Annuler",
    notifications: "Notifications",
    add_appointment: "Ajouter un rendez-vous",
    save_information: "Enregistrer les informations",
    apply_schedule: "Appliquer le planning",
    pending_verification_title: "Compte en attente de vérification",
    pending_verification_desc:
      "Votre compte professionnel est en cours d'examen. Vous recevrez un e-mail une fois approuvé.",
    waiting_confirmation: "En attente de confirmation | MediBook",
    loading_record: "Chargement du dossier...",
    top_rated: "Professionnel très bien noté",
    book_appointment_now: "Réserver un rendez-vous",
    biography: "Biographie",
    working_hours: "Heures de consultation",
    emergency_hub: "Urgences",
  },
  patient: {
    profile: "Profil patient",
    verified_badge: "Patient vérifié",
    cin_label: "Document d'identité (CIN)",
    phone_label: "Téléphone enregistré",
    not_provided: "Non renseigné",
    secure_logout: "Déconnexion sécurisée",
    nav_center: "Espace patient",
    nav_profile: "Mon profil",
    nav_settings: "Paramètres du compte",
    nav_password: "Changer le mot de passe",
    nav_support: "Centre d'assistance",
    settings_title: "Paramètres du compte",
    delete_button: "Supprimer mon compte",
  },
  appointments: {
    book: "Prendre rendez-vous",
    upcoming: "Rendez-vous à venir",
    past: "Rendez-vous passés",
    cancel: "Annuler",
    completed: "Terminé",
    configure_title: "Configurer le rendez-vous",
    configure_subtitle: "Choisissez votre créneau et le type de consultation.",
    consultation_date: "Date de consultation",
    preferred_slot: "Créneau préféré",
    category: "Catégorie de rendez-vous",
    confirm_booking: "Confirmer la réservation",
    completed_title: "Rendez-vous confirmé",
    completed_subtitle: "Votre rendez-vous a été réservé avec succès.",
    login_required_title: "Connexion requise",
    login_required_message:
      "Pour prendre rendez-vous, veuillez vous connecter ou créer un compte.",
    print: "Imprimer la confirmation",
    loading_setup: "Préparation de votre rendez-vous...",
    back_to_search: "Retour à la recherche",
    type_general: "Consultation générale",
    type_follow_up: "Visite de suivi",
    type_emergency: "Urgence",
    secured_footer: "Vos données sont sécurisées par chiffrement de bout en bout",
    loading_preparing: "Préparation du terminal de réservation...",
    secured_booking: "Système de réservation médicale sécurisé",
  },
  admin: {
    manage_doctors: "Gérer les médecins",
    verifications: "Vérifications",
    verified_doctors: "Médecins vérifiés",
    verify_doctor: "Vérifier le médecin",
    verifying: "Vérification...",
    pending: "En attente",
    patient_admissions: "Admissions patients",
    notifications: "Notifications",
    synchronizing_data: "Synchronisation des données...",
  },
  home: {
    footer_desc:
      "Rendre les soins de santé accessibles et pratiques pour tous. Réservez vos rendez-vous en quelques secondes.",
    platform: "Plateforme",
    support: "Assistance",
    faq: "FAQ",
    privacy_policy: "Politique de confidentialité",
    terms_of_service: "Conditions d'utilisation",
    trusted_platform: "La plateforme médicale la plus fiable",
    view_all_doctors: "Voir tous les médecins",
    talk_to_support: "Contacter le support",
  },
};

const arOverrides = {
  doctor: {
    welcome_doctor: "مرحباً",
    in_MediBook: "في MediBook",
    appointments_today: "لديك مواعيد مجدولة اليوم!",
    appointments: "المواعيد",
    history: "السجل",
    settings: "الإعدادات",
    dashboard_overview: "نظرة عامة على لوحة التحكم",
    account_settings: "إعدادات الحساب",
    todays_schedule: "جدول اليوم",
    incoming_appointments: "المواعيد الواردة",
    completed: "مكتمل",
    notifications: "الإشعارات",
    add_appointment: "إضافة موعد",
    save_information: "حفظ المعلومات",
    pending_verification_title: "الحساب قيد التحقق",
    pending_verification_desc:
      "يتم مراجعة حسابك المهني. ستتلقى بريداً إلكترونياً عند الموافقة.",
    waiting_confirmation: "في انتظار التأكيد | MediBook",
    loading_record: "جاري تحميل السجل...",
    top_rated: "محترف ذو تقييم عالٍ",
    book_appointment_now: "احجز موعداً الآن",
    biography: "السيرة الذاتية",
    working_hours: "ساعات العمل",
    emergency_hub: "مركز الطوارئ",
  },
  patient: {
    profile: "ملف المريض",
    verified_badge: "مريض موثق",
    cin_label: "وثيقة الهوية (CIN)",
    phone_label: "الهاتف المسجل",
    not_provided: "غير متوفر",
    secure_logout: "تسجيل خروج آمن",
    nav_center: "مركز المريض",
    nav_profile: "ملفي",
    nav_settings: "إعدادات الحساب",
    nav_password: "تغيير كلمة المرور",
    nav_support: "مركز الدعم",
    settings_title: "إعدادات الحساب",
    delete_button: "حذف حسابي",
  },
  appointments: {
    book: "حجز موعد",
    upcoming: "المواعيد القادمة",
    past: "المواعيد السابقة",
    cancel: "إلغاء",
    completed: "مكتمل",
    configure_title: "إعداد الموعد",
    configure_subtitle: "اختر الوقت ونوع الموعد أدناه.",
    consultation_date: "تاريخ الاستشارة",
    preferred_slot: "الوقت المفضل",
    category: "فئة الموعد",
    confirm_booking: "تأكيد الحجز",
    completed_title: "تم تأكيد الموعد",
    completed_subtitle: "تم حجز موعدك بنجاح.",
    login_required_title: "تسجيل الدخول مطلوب",
    login_required_message: "لحجز موعد، يرجى تسجيل الدخول أو إنشاء حساب.",
    print: "طباعة التأكيد",
    loading_setup: "جاري إعداد موعدك...",
    back_to_search: "العودة إلى البحث",
    type_general: "استشارة عامة",
    type_follow_up: "زيارة متابعة",
    type_emergency: "طوارئ",
    secured_footer: "بياناتك محمية بتشفير شامل",
    loading_preparing: "جاري تحضير نظام الحجز...",
    secured_booking: "نظام حجز طبي آمن",
  },
  admin: {
    manage_doctors: "إدارة الأطباء",
    verifications: "التحققات",
    verified_doctors: "الأطباء الموثقون",
    verify_doctor: "التحقق من الطبيب",
    verifying: "جاري التحقق...",
    pending: "قيد الانتظار",
    patient_admissions: "قبول المرضى",
    notifications: "الإشعارات",
    synchronizing_data: "جاري مزامنة البيانات...",
  },
  home: {
    footer_desc:
      "نجعل الرعاية الصحية في متناول الجميع. احجز مواعيدك مع أفضل الأطباء في ثوانٍ.",
    platform: "المنصة",
    support: "الدعم",
    faq: "الأسئلة الشائعة",
    privacy_policy: "سياسة الخصوصية",
    terms_of_service: "شروط الخدمة",
    trusted_platform: "أكثر منصة طبية موثوقة",
    view_all_doctors: "عرض جميع الأطباء",
    talk_to_support: "تحدث مع الدعم",
  },
};

function applyOverrides(target, overrides) {
  for (const [ns, keys] of Object.entries(overrides)) {
    if (!target[ns]) target[ns] = {};
    Object.assign(target[ns], keys);
  }
}

const en = JSON.parse(
  fs.readFileSync(path.join(localesDir, "en/translation.json"), "utf8")
);
const fr = JSON.parse(
  fs.readFileSync(path.join(localesDir, "fr/translation.json"), "utf8")
);
const ar = JSON.parse(
  fs.readFileSync(path.join(localesDir, "ar/translation.json"), "utf8")
);

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else if (target[key] === undefined) {
      target[key] = source[key];
    }
  }
  return target;
}

deepMerge(fr, en);
deepMerge(ar, en);
applyOverrides(fr, frOverrides);
applyOverrides(ar, arOverrides);

fs.writeFileSync(
  path.join(localesDir, "fr/translation.json"),
  JSON.stringify(fr, null, 2),
  "utf8"
);
fs.writeFileSync(
  path.join(localesDir, "ar/translation.json"),
  JSON.stringify(ar, null, 2),
  "utf8"
);
console.log("Applied FR/AR overrides");
