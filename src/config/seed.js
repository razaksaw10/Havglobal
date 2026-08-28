const bcrypt = require('bcryptjs');
const { db, initializeTables } = require('./db');

function seedDatabase() {
  initializeTables();

  // 1. Seed Admin
  const adminCount = db.prepare('SELECT COUNT(*) AS count FROM admins').get().count;
  if (adminCount === 0) {
    const email = (process.env.ADMIN_EMAIL || 'admin@havaglobaltrade.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'HavaAdmin2026!';
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.prepare(`
      INSERT INTO admins (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `).run(email, hashedPassword, 'Directeur HAVA Global', 'super_admin');
    
    console.log(`[Seed] Compte administrateur créé : ${email} / ${password}`);
  }

  // 2. Seed Categories
  const categoryCount = db.prepare('SELECT COUNT(*) AS count FROM categories').get().count;
  if (categoryCount === 0) {
    const categories = [
      {
        slug: 'textile',
        name: 'Textile & Confection',
        icon: '👔',
        description: 'Vêtements haut de gamme, uniformes professionnels, tissus et prêt-à-porter de confection turque.',
        order_index: 1
      },
      {
        slug: 'mobilier',
        name: 'Mobilier & Équipement',
        icon: '🏠',
        description: 'Mobilier d’intérieur et de bureau, agencement d’hôtels, électroménager et décoration design.',
        order_index: 2
      },
      {
        slug: 'sante',
        name: 'Santé & Cosmétiques',
        icon: '💊',
        description: 'Produits dermo-cosmétiques certifiés, compléments alimentaires et équipements médicaux.',
        order_index: 3
      },
      {
        slug: 'alimentaire',
        name: 'Agroalimentaire & Terroir',
        icon: '🍯',
        description: 'Spécialités gastronomiques turques, huiles d’olive, fruits secs, épices et confiseries d’exception.',
        order_index: 4
      }
    ];

    const insertCat = db.prepare(`
      INSERT INTO categories (slug, name, icon, description, order_index)
      VALUES (?, ?, ?, ?, ?)
    `);

    categories.forEach(cat => {
      insertCat.run(cat.slug, cat.name, cat.icon, cat.description, cat.order_index);
    });

    console.log('[Seed] 4 Secteurs/Catégories clés créés.');
  }

  // 3. Seed Products
  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
  if (productCount === 0) {
    const products = [
      // === TEXTILE ===
      {
        name: 'Chemises Formelles Business 100% Coton',
        category_slug: 'textile',
        description: 'Chemises de confection turque supérieure en coton peigné. Finition infroissable, col italien et coupe moderne.',
        price: 18.50,
        currency: 'EUR',
        min_order_qty: 50,
        specs_json: JSON.stringify(['100% Coton d’Égée peigné', 'Coupe Slim & Regular', 'Tailles du S au 4XL', 'Coloris : Blanc, Bleu ciel, Noir, Rayé']),
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&fit=crop',
        stock: 5000,
        is_featured: 1
      },
      {
        name: 'Costumes & Blazers Homme Coupe Italienne',
        category_slug: 'textile',
        description: 'Ensembles tailleurs et vestes en laine mélangée tissée à Istanbul. Finitions soignées, poches passepoilées et doublure en satin.',
        price: 85.00,
        currency: 'EUR',
        min_order_qty: 20,
        specs_json: JSON.stringify(['Laine 70% / Polyester 30%', 'Tailles 46 à 60', 'Doublure respirante anti-statique', 'Personnalisation possible de la griffe']),
        image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80&fit=crop',
        stock: 1200,
        is_featured: 1
      },
      {
        name: 'Uniformes Médicaux & Scrubs Professionnels',
        category_slug: 'textile',
        description: 'Tenues médicales complètes (blouse + pantalon) conçues en tissu antimicrobien résistant aux lavages à haute température.',
        price: 24.00,
        currency: 'EUR',
        min_order_qty: 100,
        specs_json: JSON.stringify(['Polyester / Coton avec traitement antibactérien', 'Tissu stretch pour liberté de mouvement', 'Tailles XS à 3XL', '8 coloris hospitaliers']),
        image_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80&fit=crop',
        stock: 8000,
        is_featured: 0
      },
      {
        name: 'Pantalons Chino & Pantalons de Ville',
        category_slug: 'textile',
        description: 'Pantalons élégants et confortables en gabardine de coton élasthanne. Idéal pour le commerce de prêt-à-porter.',
        price: 21.00,
        currency: 'EUR',
        min_order_qty: 60,
        specs_json: JSON.stringify(['97% Coton, 3% Élasthanne', 'Coupe fuselée moderne', 'Teinture grand teint résistant', 'Tailles 38 à 52']),
        image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80&fit=crop',
        stock: 3500,
        is_featured: 0
      },
      {
        name: 'Linge d’Hôtellerie & Serviettes de Bain Premium',
        category_slug: 'textile',
        description: 'Serviettes et peignoirs en pur coton de Denizli (Turquie), réputé pour sa douceur et sa très haute capacité d’absorption (600 g/m²).',
        price: 12.00,
        currency: 'EUR',
        min_order_qty: 150,
        specs_json: JSON.stringify(['100% Coton turc Denizli 600 GSM', 'Double couture renforcée', 'Résistant aux lavages industriels', 'Coloris blanc pur et anthracite']),
        image_url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80&fit=crop',
        stock: 6000,
        is_featured: 1
      },
      {
        name: 'Robes & Prêt-à-Porter Féminin Tendance',
        category_slug: 'textile',
        description: 'Collection saisonnière de robes fluides et tenues chics pour boutiques de mode et grossistes.',
        price: 29.50,
        currency: 'EUR',
        min_order_qty: 40,
        specs_json: JSON.stringify(['Viscose soyeuse & Crêpe', 'Designs exclusifs Istanbul Fashion', 'Tailles 36 à 46', 'Motifs et unis tendance']),
        image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80&fit=crop',
        stock: 2000,
        is_featured: 0
      },

      // === MOBILIER ===
      {
        name: 'Canapé d’Angle Contemporain & Fauteuils Velours',
        category_slug: 'mobilier',
        description: 'Salon complet moderne avec structure en bois massif renforcé, mousse haute résilience 35 DNS et tissu déperlant facile d’entretien.',
        price: 490.00,
        currency: 'EUR',
        min_order_qty: 5,
        specs_json: JSON.stringify(['Structure Bois de hêtre séché', 'Mousse HR 35 DNS confort supérieur', 'Tissu velours antitache', 'Pieds en métal doré ou noir']),
        image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&fit=crop',
        stock: 120,
        is_featured: 1
      },
      {
        name: 'Fauteuils de Bureau Ergonomiques Executive',
        category_slug: 'mobilier',
        description: 'Chaises de bureau haut de gamme avec mécanisme synchrone, support lombaire dynamique réglable et accoudoirs 3D.',
        price: 95.00,
        currency: 'EUR',
        min_order_qty: 20,
        specs_json: JSON.stringify(['Maille respirante Mesh & Similicuir', 'Vérin pneumatique classe 4 (jusqu’à 150 kg)', 'Base aluminium 5 branches', 'Garantie constructeur 3 ans']),
        image_url: 'https://images.unsplash.com/photo-1580481077194-469b2d2f1f3a?w=800&q=80&fit=crop',
        stock: 450,
        is_featured: 1
      },
      {
        name: 'Table de Salle à Manger Marbre & Métal Brossé',
        category_slug: 'mobilier',
        description: 'Table rectangulaire 8/10 personnes avec plateau en marbre turc authentique (Afyon) ou céramique haute résistance et piètement sculptural.',
        price: 340.00,
        currency: 'EUR',
        min_order_qty: 8,
        specs_json: JSON.stringify(['Plateau Marbre poli ou Céramique 12mm', 'Dimensions 200 x 100 x 76 cm', 'Structure acier inoxydable revêtu poudre', 'Poids robuste et stable']),
        image_url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80&fit=crop',
        stock: 90,
        is_featured: 0
      },
      {
        name: 'Ensemble Chambre à Coucher & Lit Coffre Moderne',
        category_slug: 'mobilier',
        description: 'Lit double avec sommier relevable à vérins hydrauliques, tête de lit capitonnée et tables de chevet assorties.',
        price: 420.00,
        currency: 'EUR',
        min_order_qty: 10,
        specs_json: JSON.stringify(['Grand coffre de rangement sous sommier', 'Tailles 160x200 ou 180x200 cm', 'Cadre acier monobloc ultra-résistant', 'Tête de lit capitonnée au choix']),
        image_url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=800&q=80&fit=crop',
        stock: 150,
        is_featured: 0
      },
      {
        name: 'Cuisines Équipées Modulaires sur Mesure',
        category_slug: 'mobilier',
        description: 'Caissons et façades laquées MDF haute densité, charnières à fermeture douce et plans de travail en quartz ou granit.',
        price: 1250.00,
        currency: 'EUR',
        min_order_qty: 3,
        specs_json: JSON.stringify(['MDF hydrofuge 18mm et placage acrylique', 'Quincaillerie européenne avec amortisseurs', 'Plans en quartz antibactérien', 'Conception modulaire 3D incluse']),
        image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80&fit=crop',
        stock: 40,
        is_featured: 1
      },

      // === SANTE & COSMETIQUES ===
      {
        name: 'Sérum Visage Anti-Âge à l’Acide Hyaluronique & Vitamine C',
        category_slug: 'sante',
        description: 'Sérum dermo-cosmétique concentré certifié ISO 22716 / GMP. Formulation naturelle pour éclat du teint et fermeté de la peau.',
        price: 8.90,
        currency: 'EUR',
        min_order_qty: 100,
        specs_json: JSON.stringify(['Contenance 30ml avec pipette compte-gouttes', 'Acide hyaluronique pur + Vitamine C 10%', 'Sans parabènes, testé dermatologiquement', 'Packaging haut de gamme personnalisable (Private Label)']),
        image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80&fit=crop',
        stock: 12000,
        is_featured: 1
      },
      {
        name: 'Gamme Capillaire Professionnelle Kératine & Argan',
        category_slug: 'sante',
        description: 'Shampoing, masque reconstructeur et huile de soin enrichis à la kératine naturelle et huile d’argan pour salons et grossistes.',
        price: 11.50,
        currency: 'EUR',
        min_order_qty: 80,
        specs_json: JSON.stringify(['Flacons 500ml et 1000ml disponibles', 'Formule sans sulfates ni silicones agressifs', 'Réparation des pointes et brillance intense', 'Conformité cosmétique européenne']),
        image_url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80&fit=crop',
        stock: 7500,
        is_featured: 0
      },
      {
        name: 'Savons d’Alep & Savons Traditionnels à l’Huile d’Olive',
        category_slug: 'sante',
        description: 'Pain de savon artisanal saponifié au chaudron selon les méthodes ancestrales d’Anatolie. 100% végétal et biodégradable.',
        price: 1.80,
        currency: 'EUR',
        min_order_qty: 250,
        specs_json: JSON.stringify(['80% Huile d’olive vierge, 20% Huile de baie de laurier', 'Poids unitaire 180g / 200g', 'Riche en vitamine E antioxydante', 'Emballage écologique kraft']),
        image_url: 'https://images.unsplash.com/photo-1607006311820-d15873f8155b?w=800&q=80&fit=crop',
        stock: 25000,
        is_featured: 1
      },
      {
        name: 'Matériel Médical & Consommables de Clinique',
        category_slug: 'sante',
        description: 'Gants nitrile stériles, masques chirurgicaux 3 plis certifiés Type IIR, seringues et compresses stériles aux normes européennes CE.',
        price: 4.50,
        currency: 'EUR',
        min_order_qty: 200,
        specs_json: JSON.stringify(['Certification CE Médical & ISO 13485', 'Boîte de 100 gants non poudrés', 'Élastomère nitrile sans latex', 'Expédition rapide en conteneurs']),
        image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&fit=crop',
        stock: 30000,
        is_featured: 0
      },

      // === AGROALIMENTAIRE ===
      {
        name: 'Huile d’Olive Vierge Extra de la Mer Égée (Bouteilles 500ml / 5L)',
        category_slug: 'alimentaire',
        description: 'Huile d’olive de première pression à froid extraite d’olives Memecik de la région d’Izmir. Acidité inférieure à 0.4%, arôme fruité intense.',
        price: 6.80,
        currency: 'EUR',
        min_order_qty: 120,
        specs_json: JSON.stringify(['Extraction à froid < 27°C', 'Acidité oléique < 0.4%', 'Bouteilles verre foncé anti-UV et bidons fer blanc 5L', 'Certifié Halal & HACCP']),
        image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&fit=crop',
        stock: 15000,
        is_featured: 1
      },
      {
        name: 'Noisettes & Pistaches de Gaziantep Sélection Export',
        category_slug: 'alimentaire',
        description: 'Pistaches grillées salées de Gaziantep et noisettes de la Mer Noire entières calibre 13-15mm. Conditionnées sous atmosphère protectrice.',
        price: 13.50,
        currency: 'EUR',
        min_order_qty: 50,
        specs_json: JSON.stringify(['Calibre Extra 13-15mm', 'Taux d’humidité contrôlé < 6%', 'Sacs sous vide 1kg, 5kg et 25kg', 'Garantie fraîcheur et croquant']),
        image_url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80&fit=crop',
        stock: 8000,
        is_featured: 1
      },
      {
        name: 'Figues Séchées & Abricots Moelleux de Malatya',
        category_slug: 'alimentaire',
        description: 'Fruits secs turcs de renommée mondiale. Abricots dorés sans sucre ajouté et figues de Smyrne moelleuses et naturellement sucrées.',
        price: 7.20,
        currency: 'EUR',
        min_order_qty: 80,
        specs_json: JSON.stringify(['Séché naturellement au soleil d’Anatolie', 'Origine contrôlée Malatya & Aydın', 'Cartons export 5kg et sachets zippés 500g', 'Riche en fibres et minéraux']),
        image_url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80&fit=crop',
        stock: 10000,
        is_featured: 0
      },
      {
        name: 'Loukoums Traditionnels & Confiseries d’Istanbul',
        category_slug: 'alimentaire',
        description: 'Assortiment de loukoums artisanaux aux pistaches, noisettes, grenade et eau de rose. Présentation en coffrets luxe pour épiceries fines.',
        price: 5.40,
        currency: 'EUR',
        min_order_qty: 100,
        specs_json: JSON.stringify(['Recette artisanale à la fécule et jus naturels', 'Garniture généreuse en fruits secs', 'Boîtes cadeau 250g, 500g et 1kg', 'Longue conservation (12 mois)']),
        image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&fit=crop',
        stock: 6000,
        is_featured: 1
      }
    ];

    const insertProd = db.prepare(`
      INSERT INTO products (name, category_slug, description, price, currency, min_order_qty, specs_json, image_url, stock, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    products.forEach(p => {
      insertProd.run(p.name, p.category_slug, p.description, p.price, p.currency, p.min_order_qty, p.specs_json, p.image_url, p.stock, p.is_featured);
    });

    console.log(`[Seed] ${products.length} produits de qualité supérieure insérés.`);
  }

  // 4. Seed Settings
  const settingsCount = db.prepare('SELECT COUNT(*) AS count FROM settings').get().count;
  if (settingsCount === 0) {
    const settings = [
      ['company_name', 'HAVA Global Trade'],
      ['tagline', 'Relier les marchés, inspirer la confiance'],
      ['phone', '+90 543 173 61 73'],
      ['whatsapp', '905431736173'],
      ['email', 'havaglobaltrade@gmail.com'],
      ['address', 'Istanbul, Turquie · Représentations Afrique & Europe'],
      ['countries_served', '45+'],
      ['partners_count', '120+'],
      ['satisfaction_rate', '99.4%']
    ];

    const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    settings.forEach(([k, v]) => insertSetting.run(k, v));
    console.log('[Seed] Paramètres généraux de la compagnie initialisés.');
  }

  // 5. Seed sample inquiries for demo if empty
  const inquiryCount = db.prepare('SELECT COUNT(*) AS count FROM inquiries').get().count;
  if (inquiryCount === 0) {
    const sampleInquiries = [
      {
        name: 'Moussa Diop',
        email: 'm.diop@africatrading.sn',
        phone: '+221 77 123 45 67',
        company: 'Dakar Imports & Logistics',
        country: 'Sénégal',
        subject: 'Demande de cotation conteneur 40ft - Chemises & Tissus',
        category_slug: 'textile',
        message: 'Bonjour, nous souhaitons importer 2000 chemises business et 500 costumes pour notre réseau de boutiques à Dakar. Merci de nous fournir vos conditions FOB Istanbul.',
        status: 'new'
      },
      {
        name: 'Jean-Marc Bertrand',
        email: 'jm.bertrand@hotel-lux.fr',
        phone: '+33 6 89 54 12 30',
        company: 'Groupe Hôtelier Méditerranée',
        country: 'France',
        subject: 'Équipement mobilier & literie 45 chambres d’hôtel',
        category_slug: 'mobilier',
        message: 'Nous rénovons un établissement de 45 chambres à Nice. Nous sommes très intéressés par vos lits coffres, bureaux et linge hôtelier 600 GSM.',
        status: 'in_progress'
      },
      {
        name: 'Amina Mansour',
        email: 'amina.pharma@distri.ci',
        phone: '+225 07 45 67 89',
        company: 'PharmaPlus Abidjan',
        country: 'Côte d’Ivoire',
        subject: 'Distribution gamme cosmétiques sérum & savons d’Alep',
        category_slug: 'sante',
        message: 'Nous aimerions devenir distributeur exclusif de votre gamme sérums acide hyaluronique et savons d’Alep en Côte d’Ivoire. Quel est le MOQ pour commande personnalisée ?',
        status: 'resolved'
      }
    ];

    const insertInq = db.prepare(`
      INSERT INTO inquiries (name, email, phone, company, country, subject, category_slug, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    sampleInquiries.forEach(inq => {
      insertInq.run(inq.name, inq.email, inq.phone, inq.company, inq.country, inq.subject, inq.category_slug, inq.message, inq.status);
    });

    console.log('[Seed] 3 demandes de devis d’exemple initialisées pour le tableau de bord admin.');
  }

  console.log('[Seed] Initialisation complète de la base de données terminée avec succès.');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase
};
