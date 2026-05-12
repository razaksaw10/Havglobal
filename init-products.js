// Initialiser les produits par défaut si le localStorage est vide
function initDefaultProducts() {
  const existing = localStorage.getItem('havaProducts');
  
  if (existing === null || existing === '') {
    const defaultProducts = [
      // Textile
      {
        id: 1001,
        category: 'textile',
        name: 'Chemises Formelles Premium',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80&fit=crop',
        price: 15,
        specs: ['100% coton', 'Plusieurs couleurs', 'Tailles S-XXXL', 'Haute qualité']
      },
      {
        id: 1002,
        category: 'textile',
        name: 'Uniformes Professionnels',
        image: 'https://images.unsplash.com/photo-1548883416-c4c2f5e8cd54?w=500&q=80&fit=crop',
        price: 20,
        specs: ['Sur mesure', 'Personnalisation possible', 'Couleurs variées', 'Durable']
      },
      {
        id: 1003,
        category: 'textile',
        name: 'Pantalons Business',
        image: 'https://images.unsplash.com/photo-1505814536877-7f43655ba8e0?w=500&q=80&fit=crop',
        price: 18,
        specs: ['Laine/Acrylique', 'Coupe élégante', 'Tailles variées', 'Confortable']
      },
      {
        id: 1004,
        category: 'textile',
        name: 'Vestes & Blazers',
        image: 'https://images.unsplash.com/photo-1527691566022-af2830c3c4cc?w=500&q=80&fit=crop',
        price: 30,
        specs: ['Premium quality', 'Design moderne', 'Coloris classiques', 'Ajustement parfait']
      },
      {
        id: 1005,
        category: 'textile',
        name: 'Accessoires Mode',
        image: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=500&q=80&fit=crop',
        price: 5,
        specs: ['Ceintures & Écharpes', 'Assorti aux vêtements', 'Qualité premium', 'Styles variés']
      },
      {
        id: 1006,
        category: 'textile',
        name: 'Prêt-à-Porter',
        image: 'https://images.unsplash.com/photo-1546296096-fb3fc6f95f98?w=500&q=80&fit=crop',
        price: 12,
        specs: ['Collections modernes', 'Tendances actuelles', 'Couleurs à la mode', 'Confortable']
      },
      // Mobilier
      {
        id: 2001,
        category: 'mobilier',
        name: 'Mobilier de Bureau',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80&fit=crop',
        price: 150,
        specs: ['Ergonomique', 'Moderne et élégant', 'Durabilité certifiée', 'Livraison gratuite']
      },
      {
        id: 2002,
        category: 'mobilier',
        name: 'Chaises Confortables',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80&fit=crop',
        price: 75,
        specs: ['Support lombaire', 'Tissu premium', 'Hauteur ajustable', 'Garantie 2 ans']
      },
      {
        id: 2003,
        category: 'mobilier',
        name: 'Tables de Salle à Manger',
        image: 'https://images.unsplash.com/photo-1566228010882-3c4c3d4f1b9a?w=500&q=80&fit=crop',
        price: 200,
        specs: ['Bois massif', 'Design élégant', 'Dimensions variées', 'Entretien facile']
      },
      {
        id: 2004,
        category: 'mobilier',
        name: 'Lits Modernes',
        image: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=500&q=80&fit=crop',
        price: 300,
        specs: ['Confort maximal', 'Tailles standard', 'Lattes de qualité', 'Sommier inclus']
      },
      {
        id: 2005,
        category: 'mobilier',
        name: 'Cuisines Équipées',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80&fit=crop',
        price: 1500,
        specs: ['Électroménagers inclus', 'Installation gratuite', 'Design moderne', 'Garantie complète']
      },
      {
        id: 2006,
        category: 'mobilier',
        name: 'Salons Complets',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80&fit=crop',
        price: 800,
        specs: ['Ensemble complet', 'Coloris variés', 'Confortable', 'Livraison & montage']
      },
      // Santé
      {
        id: 3001,
        category: 'sante',
        name: 'Cosmétiques de Luxe',
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80&fit=crop',
        price: 45,
        specs: ['Ingredients naturels', 'Certifié dermatologiquement', 'Sans cruauté', 'Hydratation intense']
      },
      {
        id: 3002,
        category: 'sante',
        name: 'Compléments Alimentaires',
        image: 'https://images.unsplash.com/photo-1471864910326-1e11a7e6a09a?w=500&q=80&fit=crop',
        price: 25,
        specs: ['Formule scientifique', 'Vitamines & minéraux', 'Certifié', 'Conditionnement varié']
      },
      {
        id: 3003,
        category: 'sante',
        name: 'Produits Médicaux',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=500&q=80&fit=crop',
        price: 35,
        specs: ['Certifié médical', 'Stérile & sûr', 'Conformité internationale', 'Usage professionnel']
      },
      {
        id: 3004,
        category: 'sante',
        name: 'Soins de la Peau',
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80&fit=crop',
        price: 30,
        specs: ['Formule anti-âge', 'Protection UV', 'Hydratation durable', 'Tous types de peau']
      },
      {
        id: 3005,
        category: 'sante',
        name: 'Bien-être & Relaxation',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80&fit=crop',
        price: 20,
        specs: ['Huiles essentielles', 'Aromathérapie', 'Naturel & pur', 'Relaxation garantie']
      },
      {
        id: 3006,
        category: 'sante',
        name: 'Suppléments Vitaminés',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5f15714ae?w=500&q=80&fit=crop',
        price: 22,
        specs: ['Renforce immunité', 'Énergie naturelle', 'Sans allergènes', 'Dosage optimal']
      },
      // Alimentaire
      {
        id: 4001,
        category: 'alimentaire',
        name: 'Huiles d\'Olive Premium',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80&fit=crop',
        price: 28,
        specs: ['Extra vierge', 'Récolte manuelle', 'Pressage à froid', 'Bouteille 500ml']
      },
      {
        id: 4002,
        category: 'alimentaire',
        name: 'Épices Authentiques',
        image: 'https://images.unsplash.com/photo-1596040232902-f19d926ccdec?w=500&q=80&fit=crop',
        price: 12,
        specs: ['Poivre, curcuma, etc.', 'Goût authentique', 'Conditionnement 200g', 'Provenance vérifiée']
      },
      {
        id: 4003,
        category: 'alimentaire',
        name: 'Miel Naturel Certifié',
        image: 'https://images.unsplash.com/photo-1618399260368-5b7f2f0e9c8f?w=500&q=80&fit=crop',
        price: 18,
        specs: ['100% naturel', 'Certifié Bio', 'Saveur riche', 'Pot 500g']
      },
      {
        id: 4004,
        category: 'alimentaire',
        name: 'Fruits Secs & Noix',
        image: 'https://images.unsplash.com/photo-1585707495365-25ffcc0ce3f1?w=500&q=80&fit=crop',
        price: 15,
        specs: ['Amandes, noix, raisins', 'Premium quality', 'Sachet 250g', 'Saveur authentique']
      },
      {
        id: 4005,
        category: 'alimentaire',
        name: 'Pâtes Artisanales',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80&fit=crop',
        price: 8,
        specs: ['Blé dur premium', 'Séchage traditionnel', 'Couleur dorée', 'Cuisson parfaite']
      },
      {
        id: 4006,
        category: 'alimentaire',
        name: 'Produits Transformés',
        image: 'https://images.unsplash.com/photo-1488459716781-6918f6980563?w=500&q=80&fit=crop',
        price: 20,
        specs: ['Conserves qualité', 'Recettes traditionnelles', 'Saveur intense', 'Longue conservation']
      }
    ];

    localStorage.setItem('havaProducts', JSON.stringify(defaultProducts));
  }
}

// Exécuter au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDefaultProducts);
} else {
  initDefaultProducts();
}
