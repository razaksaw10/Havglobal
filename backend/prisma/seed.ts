import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du Seeding HAVA Global Trade pour NestJS...');

  // 1. Seed Super Admin
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@havaglobaltrade.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'HavaAdmin2026!';
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: 'Razak',
      role: 'super_admin'
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Razak',
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
      price: 6.80,
      currency: 'EUR',
      minOrderQty: 300,
      specsJson: JSON.stringify([
        { label: 'Grammage', value: '220 g/m² Coton Peigné Égéen' },
        { label: 'Couleurs', value: '24 teintes Pantone au choix' },
        { label: 'Certification', value: 'OEKO-TEX Standard 100' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80&fit=crop',
      stock: 5000,
      isFeatured: false
    },
    {
      name: 'Jeans Denim Stretch Premium Export',
      categorySlug: 'textile',
      description: 'Pantalons jeans denim denim tissé en Turquie avec délavage écologique à l’ozone. Excellente durabilité, coupe moderne regular et slim fit.',
      price: 13.50,
      currency: 'EUR',
      minOrderQty: 200,
      specsJson: JSON.stringify([
        { label: 'Composition', value: '98% Coton, 2% Élasthanne' },
        { label: 'Poids tissu', value: '11.5 oz - 12.5 oz' },
        { label: 'Finition', value: 'Stone wash, Whiskering' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80&fit=crop',
      stock: 1500,
      isFeatured: true
    },
    {
      name: 'Linge de Maison & Serviettes Éponge Coton Égéen',
      categorySlug: 'textile',
      description: 'Parures de bain hôtel 5 étoiles et serviettes éponge ultra-absorbantes tissées à Denizli. Douceur longue durée et résistance aux lavages industriels.',
      price: 4.20,
      currency: 'EUR',
      minOrderQty: 250,
      specsJson: JSON.stringify([
        { label: 'Qualité', value: '550 g/m² Ring Spun 100% Coton' },
        { label: 'Usage', value: 'Hôtellerie, Spa & Boutiques Maison' },
        { label: 'Origine', value: 'Denizli, Turquie' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&q=80&fit=crop',
      stock: 3200,
      isFeatured: false
    },

    // MOBILIER
    {
      name: 'Canapé d’Angle Modulaire Velours & Chêne',
      categorySlug: 'mobilier',
      description: 'Grand canapé contemporain fabriqué à İnegöl. Structure en bois massif certifié FSC, assise mousse haute résilience 35 HR et revêtement velours déperlant.',
      price: 340.00,
      currency: 'EUR',
      minOrderQty: 10,
      specsJson: JSON.stringify([
        { label: 'Dimensions', value: '310 x 190 x 85 cm' },
        { label: 'Structure', value: 'Bois de hêtre massif et métal' },
        { label: 'Tissu', value: 'Velours antitache lavable' },
        { label: 'Garantie', value: '5 ans fabricant' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&fit=crop',
      stock: 60,
      isFeatured: true
    },
    {
      name: 'Fauteuil Ergonomique Bureau Direction en Cuir',
      categorySlug: 'mobilier',
      description: 'Siège de bureau professionnel pivotant avec soutien lombaire dynamique, accoudoirs 4D et mécanisme synchrone verrouillable multi-positions.',
      price: 78.00,
      currency: 'EUR',
      minOrderQty: 20,
      specsJson: JSON.stringify([
        { label: 'Mécanisme', value: 'Synchrone avec réglage de tension' },
        { label: 'Revêtement', value: 'Cuir PU microfibre respirant' },
        { label: 'Norme', value: 'EN 1335 / BIFMA Class 4' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3a8b417e089?w=800&q=80&fit=crop',
      stock: 220,
      isFeatured: false
    },
    {
      name: 'Table à Manger Marbre & Piètement Métal Noir',
      categorySlug: 'mobilier',
      description: 'Table rectangulaire 8 couverts avec plateau en céramique aspect marbre de Carrare ou marbre d’Afyon poli. Haute résistance aux rayures et à la chaleur.',
      price: 185.00,
      currency: 'EUR',
      minOrderQty: 15,
      specsJson: JSON.stringify([
        { label: 'Dimensions', value: '200 x 100 x 76 cm' },
        { label: 'Plateau', value: 'Céramique 12mm / Marbre Afyon' },
        { label: 'Piètement', value: 'Acier thermolaqué noir mat' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80&fit=crop',
      stock: 90,
      isFeatured: true
    },
    {
      name: 'Chambre Complète Hôtelière Design Contemporain',
      categorySlug: 'mobilier',
      description: 'Ensemble mobilier pour agencement d’hôtel : Tête de lit avec liseuses LED intégrées, 2 chevets, bureau suspendu, meuble TV et penderie modulaire.',
      price: 490.00,
      currency: 'EUR',
      minOrderQty: 12,
      specsJson: JSON.stringify([
        { label: 'Matériaux', value: 'MDF mélaminé haute densité ignifugé' },
        { label: 'Équipements', value: 'Prises USB/Schuko intégrées, éclairage LED' },
        { label: 'Projets', value: 'Hôtels 3*, 4*, Résidences universitaires' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80&fit=crop',
      stock: 40,
      isFeatured: false
    },

    // SANTE & COSMETIQUES
    {
      name: 'Sérum Anti-Âge Acide Hyaluronique & Vitamine C',
      categorySlug: 'sante',
      description: 'Formulation dermo-cosmétique avancée pour le soin du visage, enrichie en extraits botaniques d’Anatolie. Flacon pipette en verre ambré sérigraphié.',
      price: 3.40,
      currency: 'EUR',
      minOrderQty: 500,
      specsJson: JSON.stringify([
        { label: 'Volume', value: '30 ml (Pipette compte-gouttes)' },
        { label: 'Actifs', value: 'Acide Hyaluronique 2%, Vitamine C 10%, Niacinamide' },
        { label: 'Certification', value: 'GMP Cosmetics, Testé dermatologiquement' },
        { label: 'Marque Blanche', value: 'Formule et packaging personnalisables (OEM)' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80&fit=crop',
      stock: 8000,
      isFeatured: true
    },
    {
      name: 'Savon Artisanal d’Alep & Huile d’Olive Bio',
      categorySlug: 'sante',
      description: 'Savons traditionnels saponifiés à froid avec huile d’olive de la région d’Izmir et 20% d’huile de baie de laurier. 100% naturel sans parfum de synthèse.',
      price: 0.95,
      currency: 'EUR',
      minOrderQty: 1000,
      specsJson: JSON.stringify([
        { label: 'Poids', value: '150 g par pain' },
        { label: 'Composition', value: 'Huile d’olive 80%, Laurier 20%, Eau, Soude' },
        { label: 'Conditionnement', value: 'Cartons de 72 unités sous film biodégradable' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1607006314144-88f50424564c?w=800&q=80&fit=crop',
      stock: 12000,
      isFeatured: false
    },
    {
      name: 'Eau de Rose de Damas Pure Distillée Isparta',
      categorySlug: 'sante',
      description: 'Tonique facial 100% pur obtenu par hydro-distillation des pétales de fleurs de Rosa Damascena récoltées à l’aube à Isparta. Vertus apaisantes et régénérantes.',
      price: 2.80,
      currency: 'EUR',
      minOrderQty: 400,
      specsJson: JSON.stringify([
        { label: 'Contenance', value: '200 ml Spray vaporisateur' },
        { label: 'Origine', value: 'Isparta, Vallée des Roses, Turquie' },
        { label: 'Pureté', value: 'Sans conservateurs, sans alcool' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80&fit=crop',
      stock: 4500,
      isFeatured: true
    },
    {
      name: 'Compléments Alimentaires Spiruline & Collagène Marin',
      categorySlug: 'sante',
      description: 'Gélules végétales certifiées ISO 22000 & Halal. Formule synergique pour la beauté de la peau, le tonus et le soutien articulaire.',
      price: 4.80,
      currency: 'EUR',
      minOrderQty: 300,
      specsJson: JSON.stringify([
        { label: 'Pilulier', value: '60 gélules gastro-résistantes' },
        { label: 'Dosage', value: 'Collagène hydrolysé type 1 & 3 (500mg), Spiruline (200mg)' },
        { label: 'Certificats', value: 'Halal, ISO 9001, HACCP' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&fit=crop',
      stock: 3000,
      isFeatured: false
    },

    // AGROALIMENTAIRE
    {
      name: 'Huile d’Olive Extra Vierge Première Pression à Froid',
      categorySlug: 'alimentaire',
      description: 'Huile d’olive de terroir d’Égée (Ayvalık) à très faible acidité (< 0.4%). Goût fruité intense, arômes d’herbe fraîche et d’artichaut. Idéale pour la grande distribution et l’épicerie fine.',
      price: 5.60,
      currency: 'EUR',
      minOrderQty: 500,
      specsJson: JSON.stringify([
        { label: 'Conditionnement', value: 'Bouteille verre foncé 750ml / Bidon métal 5L' },
        { label: 'Acidité', value: '< 0.4 % max' },
        { label: 'Origine', value: 'Ayvalık / Mer Égée, Turquie' },
        { label: 'Analyses', value: 'Certificat phytosanitaire & laboratoire fourni' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&fit=crop',
      stock: 6000,
      isFeatured: true
    },
    {
      name: 'Noisettes de la Mer Noire Décortiquées Grillées',
      categorySlug: 'alimentaire',
      description: 'Noisettes entières de calibre 13-15 mm en provenance de Giresun. Torréfaction uniforme, croustillantes et riches en saveurs, idéales pour chocolatiers et industriels.',
      price: 7.20,
      currency: 'EUR',
      minOrderQty: 200,
      specsJson: JSON.stringify([
        { label: 'Conditionnement', value: 'Sacs sous vide 25 kg en carton export' },
        { label: 'Calibre', value: '13-15 mm (Rendement élevé)' },
        { label: 'Humidité', value: '< 1.5 %' },
        { label: 'Origine', value: 'Giresun / Mer Noire, Turquie' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80&fit=crop',
      stock: 4500,
      isFeatured: false
    },
    {
      name: 'Figues Sèches d’Izmir Naturelles Calibre 1',
      categorySlug: 'alimentaire',
      description: 'Figues séchées au soleil d’Aydın/Izmir, moelleuses et sans ajout de sucre. Riches en fibres et potassium, emballées en barquettes ou cartons de vrac.',
      price: 4.50,
      currency: 'EUR',
      minOrderQty: 300,
      specsJson: JSON.stringify([
        { label: 'Variété', value: 'Sarılop (Figue blanche d’Anatolie)' },
        { label: 'Calibre', value: 'Numéro 1 (36-40 pièces / kg)' },
        { label: 'Certifications', value: 'Bio / BRC / IFS / Halal' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=800&q=80&fit=crop',
      stock: 3500,
      isFeatured: true
    },
    {
      name: 'Loukoums Traditionnels Pistaches d’Antep & Miel',
      categorySlug: 'alimentaire',
      description: 'Confiserie ottomane artisanale à base d’amidon naturel, sucre de canne et 35% de pistaches fraîches de Gaziantep. Sans gélatine animale, texture fondante.',
      price: 6.90,
      currency: 'EUR',
      minOrderQty: 250,
      specsJson: JSON.stringify([
        { label: 'Conditionnement', value: 'Boîtes cadeaux de prestige 450g / Vrac 3kg' },
        { label: 'Teneur en pistache', value: '35 % Pistache verte Antep' },
        { label: 'Conservation', value: '12 mois à température ambiante' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80&fit=crop',
      stock: 2800,
      isFeatured: false
    }
  ];

  await prisma.product.deleteMany({});

  for (const prod of productsData) {
    await prisma.product.create({
      data: prod
    });
  }
  console.log(`✅ ${productsData.length} Produits B2B initialisés avec succès.`);

  // 4. Sample Inquiry
  const sampleInquiry = await prisma.inquiry.create({
    data: {
      name: 'Moussa Diallo',
      email: 'm.diallo@afriquetrade-group.com',
      phone: '+221 77 654 32 10',
      company: 'Afrique Trade & Distribution SAS',
      country: 'Sénégal',
      subject: 'Demande de cotation conteneur 40ft Huile d’olive & Figues',
      categorySlug: 'alimentaire',
      message: 'Bonjour, nous souhaitons importer 1 conteneur 40 pieds d’huile d’olive extra vierge 5L ainsi que des cartons de figues séchées à destination du port de Dakar. Merci de nous transmettre une offre CIF Dakar avec délais de production.',
      status: 'in_progress',
      notes: 'Premier contact reçu. Devis proforma FOB + estimation fret maritime Dakar en cours avec notre transitaire.'
    }
  });
  console.log(`✅ Demande de devis exemple créée (ID: ${sampleInquiry.id})`);

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
