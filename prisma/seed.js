const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du Seeding HAVA Global Trade avec Prisma...');

  // 1. Seed Super Admin
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@havaglobaltrade.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'HavaAdmin2026!';
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: 'Directeur HAVA Global',
      role: 'super_admin'
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Directeur HAVA Global',
      role: 'super_admin'
    }
  });
  console.log(`✅ Compte Administrateur configuré : ${admin.email} (Rôle: ${admin.role})`);

  // 2. Seed Categories
  const categoriesData = [
    {
      slug: 'textile',
      name: 'Textile & Confection',
      icon: '👔',
      description: 'Vêtements haut de gamme, uniformes professionnels, tissus et prêt-à-porter de confection turque.',
      orderIndex: 1
    },
    {
      slug: 'mobilier',
      name: 'Mobilier & Équipement',
      icon: '🏠',
      description: 'Mobilier d’intérieur et de bureau, agencement d’hôtels, électroménager et décoration design.',
      orderIndex: 2
    },
    {
      slug: 'sante',
      name: 'Santé & Cosmétiques',
      icon: '💊',
      description: 'Produits dermo-cosmétiques certifiés, compléments alimentaires et équipements médicaux.',
      orderIndex: 3
    },
    {
      slug: 'alimentaire',
      name: 'Agroalimentaire & Terroir',
      icon: '🍯',
      description: 'Spécialités gastronomiques turques, huiles d’olive, fruits secs, épices et confiseries d’exception.',
      orderIndex: 4
    }
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
        orderIndex: cat.orderIndex
      },
      create: cat
    });
  }
  console.log('✅ 4 Catégories principales initialisées.');

  // 3. Seed Products
  const productsData = [
    // TEXTILE
    {
      name: 'Costume Homme Sur-Mesure Laine & Soie',
      categorySlug: 'textile',
      description: 'Costume 2 pièces pour homme confectionné avec un tissu premium en laine mérinos et finitions main. Coupe italienne ajustée, idéal pour les marques de luxe et détaillants haut de gamme.',
      price: 95.00,
      currency: 'EUR',
      minOrderQty: 50,
      specsJson: JSON.stringify([
        { label: 'Matière', value: '80% Laine Vierge, 20% Soie' },
        { label: 'Tailles disponibles', value: '44 au 62 (EU)' },
        { label: 'Origine Tissu', value: 'Bursa, Turquie' },
        { label: 'Personnalisation', value: 'Boutons gravés, étiquette client' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80&fit=crop',
      stock: 400,
      isFeatured: true
    },
    {
      name: 'Lot de Polos Piqué 100% Coton Peigné',
      categorySlug: 'textile',
      description: 'Polos professionnels à col boutonné et manches courtes en maille piquée ultra-résistante (220 g/m²). Traitement anti-rétrécissement et grand teint.',
      price: 8.50,
      currency: 'EUR',
      minOrderQty: 200,
      specsJson: JSON.stringify([
        { label: 'Grammage', value: '220 g/m²' },
        { label: 'Composition', value: '100% Coton Peigné Égéen' },
        { label: 'Certifications', value: 'OEKO-TEX Standard 100' },
        { label: 'Couleurs', value: '18 teintes disponibles' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80&fit=crop',
      stock: 1500,
      isFeatured: true
    },
    {
      name: 'Linge de Maison & Draps en Coton Satiné',
      categorySlug: 'textile',
      description: 'Parure de lit d’hôtellerie 5 étoiles en satin de coton 300 fils/cm². Toucher soyeux, résistance aux lavages industriels à haute température.',
      price: 24.00,
      currency: 'EUR',
      minOrderQty: 100,
      specsJson: JSON.stringify([
        { label: 'Tissage', value: 'Satin 300 fils/cm²' },
        { label: 'Dimensions', value: '140x200, 160x200, 180x200 cm' },
        { label: 'Usage', value: 'Hôtellerie, Résidentiel luxe' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80&fit=crop',
      stock: 650,
      isFeatured: false
    },
    {
      name: 'Uniformes Médicaux & Scrubs Antibactériens',
      categorySlug: 'textile',
      description: 'Ensemble tunique et pantalon pour personnel soignant. Tissu technique traité déperlant et antibactérien, coupe ergonomique et poches multiples.',
      price: 14.20,
      currency: 'EUR',
      minOrderQty: 150,
      specsJson: JSON.stringify([
        { label: 'Technologie', value: 'Finition Silver Ion Antibactérienne' },
        { label: 'Composition', value: '65% Polyester, 35% Coton' },
        { label: 'Lavage', value: 'Lavable à 60°C' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80&fit=crop',
      stock: 800,
      isFeatured: false
    },

    // MOBILIER
    {
      name: 'Fauteuil Lounge Design en Cuir & Noyer',
      categorySlug: 'mobilier',
      description: 'Fauteuil contemporain à structure en noyer massif d’Anatolie et assise en cuir véritable patiné. Équilibre parfait entre artisanat turc et design scandinave.',
      price: 220.00,
      currency: 'EUR',
      minOrderQty: 20,
      specsJson: JSON.stringify([
        { label: 'Structure', value: 'Noyer Massif séché au four' },
        { label: 'Revêtement', value: 'Cuir pleine fleur italien' },
        { label: 'Dimensions', value: '82 x 78 x 75 cm' },
        { label: 'Charge max', value: '160 kg' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80&fit=crop',
      stock: 120,
      isFeatured: true
    },
    {
      name: 'Canapé Modulaire 4 Places Velours Côtelé',
      categorySlug: 'mobilier',
      description: 'Canapé composable grand confort avec mousse haute résilience HR 35 kg/m³. Tissu antitache et déhoussable, idéal pour projets résidentiels et tertiaires.',
      price: 490.00,
      currency: 'EUR',
      minOrderQty: 10,
      specsJson: JSON.stringify([
        { label: 'Dimensions', value: '290 x 180 x 78 cm' },
        { label: 'Mousse', value: 'HR 35 kg/m³ avec couche plume' },
        { label: 'Suspension', value: 'Ressorts ensachés + sangles élastiques' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&fit=crop',
      stock: 45,
      isFeatured: true
    },
    {
      name: 'Table de Salle à Manger Marbre Blanc & Acier Noir',
      categorySlug: 'mobilier',
      description: 'Plateau en marbre blanc de Marmara poli avec chants biseautés et piétement sculptural en acier thermolaqué noir mat.',
      price: 340.00,
      currency: 'EUR',
      minOrderQty: 15,
      specsJson: JSON.stringify([
        { label: 'Plateau', value: 'Marbre de Marmara épaisseur 20 mm' },
        { label: 'Piétement', value: 'Acier découpé laser 8 mm' },
        { label: 'Dimensions', value: '200 x 100 x 75 cm' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80&fit=crop',
      stock: 60,
      isFeatured: false
    },
    {
      name: 'Poste de Travail Ergonomique Réglable en Hauteur',
      categorySlug: 'mobilier',
      description: 'Bureau professionnel assis-debout motorisé double moteur silencieux. Plateau mélaminé résistant aux rayures avec passe-câbles intégré.',
      price: 185.00,
      currency: 'EUR',
      minOrderQty: 25,
      specsJson: JSON.stringify([
        { label: 'Motorisation', value: 'Double moteur 24V (35 mm/s)' },
        { label: 'Hauteur', value: 'Ajustable de 65 à 125 cm' },
        { label: 'Capacité', value: '120 kg' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80&fit=crop',
      stock: 180,
      isFeatured: false
    },

    // SANTE & COSMETIQUES
    {
      name: 'Sérum Anti-Âge à l’Huile de Rose d’Isparta',
      categorySlug: 'sante',
      description: 'Sérum visage dermo-cosmétique enrichi à l’huile essentielle de Rose de Damas récoltée à la main à Isparta et à l’acide hyaluronique pur. Flacon pipette 30ml.',
      price: 9.80,
      currency: 'EUR',
      minOrderQty: 300,
      specsJson: JSON.stringify([
        { label: 'Contenance', value: 'Flacon verre ambré 30 ml' },
        { label: 'Ingrédients actifs', value: 'Rosa Damascena Flower Oil, Acide Hyaluronique 2%' },
        { label: 'Tests', value: 'Testé sous contrôle dermatologique' },
        { label: 'Normes', value: 'ISO 22716 GMP & CPNP Européen' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-bb5b6b15efbe?w=800&q=80&fit=crop',
      stock: 2500,
      isFeatured: true
    },
    {
      name: 'Savon Artisanal Traditionnel d’Alep & Laurier',
      categorySlug: 'sante',
      description: 'Pain de savon d’origine fabriqué à Hatay avec 40% d’huile de baie de laurier et 60% d’huile d’olive de première pression. Cure de séchage naturelle de 9 mois.',
      price: 2.10,
      currency: 'EUR',
      minOrderQty: 500,
      specsJson: JSON.stringify([
        { label: 'Poids unitaire', value: '200 g' },
        { label: 'Teneur Laurier', value: '40% Garanti' },
        { label: 'Propriétés', value: 'Purifiant, peaux sensibles et atopiques' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1607006314144-8e10be697526?w=800&q=80&fit=crop',
      stock: 4000,
      isFeatured: false
    },
    {
      name: 'Boîte de Masques Chirurgicaux Type IIR (x50)',
      categorySlug: 'sante',
      description: 'Masques médicaux 3 plis haute filtration BFE ≥ 98%. Élastiques auriculaires doux et barrette nasale ajustable. Certifiés CE dispositif médical.',
      price: 1.85,
      currency: 'EUR',
      minOrderQty: 1000,
      specsJson: JSON.stringify([
        { label: 'Norme', value: 'EN 14683:2019 Type IIR' },
        { label: 'Filtration', value: 'BFE ≥ 98%, Résistant aux projections' },
        { label: 'Conditionnement', value: 'Carton de 40 boîtes de 50 (2000 pcs)' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=800&q=80&fit=crop',
      stock: 12000,
      isFeatured: false
    },
    {
      name: 'Huile d’Argan & Nigelle Pure Pressée à Froid',
      categorySlug: 'sante',
      description: 'Huile végétale vierge 100% pure de Nigella Sativa (Cumin noir d’Anatolie). Puissant antioxydant pour cosmétiques et compléments bien-être.',
      price: 6.40,
      currency: 'EUR',
      minOrderQty: 200,
      specsJson: JSON.stringify([
        { label: 'Procédé', value: 'Première pression à froid mécanique' },
        { label: 'Contenance', value: 'Flacon 100 ml ou Vrac Fût 200L' },
        { label: 'Pureté', value: '100% pure, sans additifs' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&q=80&fit=crop',
      stock: 1800,
      isFeatured: false
    },

    // ALIMENTAIRE
    {
      name: 'Huile d’Olive Extra Vierge de la Mer Égée (Bidon 5L)',
      categorySlug: 'alimentaire',
      description: 'Huile d’olive d’appellation Ayvalık / Mer Égée, récolte précoce à froid. Acidité inférieure à 0,3%, goût fruité intense aux notes d’herbe fraîche et d’amande verte.',
      price: 38.00,
      currency: 'EUR',
      minOrderQty: 80,
      specsJson: JSON.stringify([
        { label: 'Acidité', value: '< 0,3%' },
        { label: 'Conditionnement', value: 'Bidon métallique alimentaire 5 Litres' },
        { label: 'Récolte', value: 'Mécanique & Manuelle, extraction < 27°C' },
        { label: 'Certifications', value: 'HACCP, ISO 22000, Halal' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&fit=crop',
      stock: 950,
      isFeatured: true
    },
    {
      name: 'Noisettes de la Mer Noire Décortiquées & Torréfiées',
      categorySlug: 'alimentaire',
      description: 'Noisettes de Giresun calibre 13-15 mm, réputées comme les meilleures du monde pour les chocolatiers et industriels agroalimentaires. Arôme toasté riche.',
      price: 7.90,
      currency: 'EUR',
      minOrderQty: 250,
      specsJson: JSON.stringify([
        { label: 'Calibre', value: '13-15 mm' },
        { label: 'Humidité', value: 'Max 3.5%' },
        { label: 'Emballage', value: 'Sacs sous-vide 10 kg / Big Bags 1000 kg' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&q=80&fit=crop',
      stock: 3500,
      isFeatured: true
    },
    {
      name: 'Coffret Loukoums Traditionnels d’Istanbul aux Pistaches',
      categorySlug: 'alimentaire',
      description: 'Confiserie ottomane artisanale cuite au chaudron en cuivre, généreusement garnie de pistaches vertes d’Antep et parfumée à l’eau de rose et grenade.',
      price: 5.20,
      currency: 'EUR',
      minOrderQty: 150,
      specsJson: JSON.stringify([
        { label: 'Poids net', value: '454 g (1 lb) boîte premium or' },
        { label: 'Teneur Pistache', value: '25% minimum de pistaches d’Antep' },
        { label: 'Conservation', value: '12 mois au sec' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=800&q=80&fit=crop',
      stock: 1200,
      isFeatured: false
    },
    {
      name: 'Figues Séchées Naturelles d’Izmir AOP (Boîte 1kg)',
      categorySlug: 'alimentaire',
      description: 'Figues blanches d’Aydın séchées naturellement sous le soleil égéen, sans conservateur chimique ni soufre. Moelleuses et riches en fibres.',
      price: 6.80,
      currency: 'EUR',
      minOrderQty: 100,
      specsJson: JSON.stringify([
        { label: 'Calibre', value: 'No. 2 (46-50 fruits/kg)' },
        { label: 'Traitement', value: 'Séchage solaire 100% naturel sans SO2' },
        { label: 'Conditionnement', value: 'Boîte carton de 1 kg ou caisse 10 kg' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80&fit=crop',
      stock: 800,
      isFeatured: false
    }
  ];

  // Nettoyage et insertion des produits
  await prisma.product.deleteMany({});
  for (const prod of productsData) {
    await prisma.product.create({
      data: prod
    });
  }
  console.log(`✅ ${productsData.length} Produits de haute qualité créés.`);

  // 4. Seed Inquiries (Échantillons pour démo)
  const inquiriesCount = await prisma.inquiry.count();
  if (inquiriesCount === 0) {
    await prisma.inquiry.createMany({
      data: [
        {
          name: 'Jean-Marc Dubois',
          email: 'jm.dubois@luxor-textile.fr',
          phone: '+33 6 12 34 56 78',
          company: 'Luxor Distribution SAS',
          country: 'France',
          subject: 'Demande de devis - 2000 Polos Coton & 300 Costumes',
          categorySlug: 'textile',
          message: 'Bonjour, nous préparons notre collection automne et souhaitons obtenir une cotation FOB Istanbul avec notre propre étiquette de marque. Merci de nous contacter rapidement.',
          status: 'new'
        },
        {
          name: 'Fatou Ndiaye',
          email: 'f.ndiaye@dakar-equip.sn',
          phone: '+221 77 654 32 10',
          company: 'Hôtellerie & Résidences Dakar',
          country: 'Sénégal',
          subject: 'Agencement de 45 chambres d’hôtel - Mobilier et Linge',
          categorySlug: 'mobilier',
          message: 'Nous avons un projet de rénovation hôtelière complète et souhaitons importer des parures de lit satinées et fauteuils lounge. Pouvez-vous organiser le groupage et transport maritime ?',
          status: 'in_progress'
        },
        {
          name: 'Dr. Tariq Al-Mansoor',
          email: 'procurement@gulf-pharma.ae',
          phone: '+971 50 987 6543',
          company: 'Gulf Medical Supplies LLC',
          country: 'Émirats Arabes Unis',
          subject: 'Commande en gros de Masques IIR et Sérums cosmétiques',
          categorySlug: 'sante',
          message: 'Bonjour, nous souhaitons passer commande d’un conteneur 20 pieds de produits médicaux et dermo-cosmétiques certifiés CE. Merci de nous faire parvenir vos certificats et liste de prix.',
          status: 'resolved'
        }
      ]
    });
    console.log('✅ 3 Demandes de devis d’exemple créées.');
  }

  // 5. Seed Activity Logs
  await prisma.activityLog.create({
    data: {
      adminId: admin.id,
      action: 'SYSTEM_SEED',
      details: 'Initialisation complète de la base de données Prisma',
      ipAddress: '127.0.0.1'
    }
  });

  console.log('🎉 Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
