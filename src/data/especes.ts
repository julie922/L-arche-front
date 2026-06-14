export interface SousEspece {
  id: string
  nom: string
  tags: string
  emoji: string
  intro: string
  stats: { sociabilite: number; activite: number; independance: number; entretien: number }
  gardienInfo: string
  sections: { titre: string; contenu: string }[]
}

export interface Espece {
  id: string
  nom: string
  nomComplet: string
  categorie: 'chiens' | 'chats' | 'rongeurs' | 'reptiles' | 'oiseaux' | 'nac'
  tags: string
  emoji: string
  description: string
  intro: string
  stats: { sociabilite: number; activite: number; independance: number; entretien: number }
  gardienInfo: string
  sections: { titre: string; contenu: string }[]
  sousEspeces?: SousEspece[]
}

export const ESPECES: Espece[] = [
  {
    id: 'chien',
    nom: 'Chien',
    nomComplet: 'Le Chien',
    categorie: 'chiens',
    tags: 'Social, actif, fidèle',
    emoji: '🐕',
    description: 'Compagnon fidèle qui a besoin de présence et d\'exercice quotidien.',
    intro: 'Compagnon social et actif, le chien a besoin de présence, d\'exercices et de routines stables pour s\'épanouir.',
    stats: { sociabilite: 9, activite: 8, independance: 2, entretien: 6 },
    gardienInfo: 'Le chien est un animal de meute qui souffre de l\'isolement. Il a besoin de 2 à 3 sorties par jour minimum, d\'un contact humain régulier et d\'une routine stable pour ses repas. La cohérence dans les règles est essentielle : ne pas autoriser ce qui est interdit chez son maître.',
    sections: [
      { titre: 'Alimentation', contenu: 'Le chien doit être nourri 1 à 2 fois par jour avec des croquettes adaptées à son âge et sa taille. Respectez les quantités recommandées par le vétérinaire et assurez-vous qu\'il ait toujours accès à de l\'eau fraîche. Évitez les restes de table, le chocolat, les raisins et les oignons qui sont toxiques.' },
      { titre: 'Logement et espace', contenu: 'Un espace calme avec son panier ou sa couverture habituelle est essentiel. Idéalement un jardin clos pour les grandes races. Évitez de laisser le chien seul plus de 4-5h. Son coin doit être à l\'abri des courants d\'air et loin des zones très fréquentées.' },
      { titre: 'Exercice et stimulation', contenu: 'Minimum 2 sorties par jour d\'au moins 30 minutes chacune. Les grands chiens actifs nécessitent 1h30 à 2h d\'exercice quotidien. Les jouets d\'intelligence et les jeux de flair sont d\'excellents compléments pour fatiguer mentalement l\'animal.' },
      { titre: 'Santé', contenu: 'Vérifiez que les vaccins sont à jour (rage, leptospirose, maladie de Carré). Appliquez un antiparasitaire régulièrement. Signalez tout comportement inhabituel, vomissements répétés, diarrhée ou abattement au propriétaire immédiatement.' },
      { titre: 'Signaux de stress', contenu: 'Un chien stressé peut bailler excessivement, se lécher les babines, éviter le contact visuel ou se coucher sur le dos. La destruction d\'objets et les aboiements incessants signalent un mal-être. En cas de doute, contactez le propriétaire.' },
    ],
    sousEspeces: [
      { id: 'berger-allemand', nom: 'Berger Allemand', tags: 'Loyal, protecteur, intelligent', emoji: '🐕', intro: 'Chien de travail par excellence, le Berger Allemand est loyal et protecteur. Il a besoin d\'exercice intense et de stimulation mentale quotidienne.', stats: { sociabilite: 7, activite: 10, independance: 3, entretien: 7 }, gardienInfo: 'Le Berger Allemand peut être méfiant envers les inconnus. Présentez-vous calmement avec l\'accord du propriétaire. Il a besoin d\'au moins 2h d\'exercice par jour et supporte mal l\'inactivité.', sections: [{ titre: 'Exercice', contenu: 'Minimum 2h par jour. Combinaison de marche, course et jeux de flair ou d\'obéissance. Un Berger Allemand sous-stimulé développe des comportements destructeurs.' }, { titre: 'Tempérament', contenu: 'Très attaché à son maître, il peut montrer de l\'anxiété de séparation. Maintenez sa routine habituelle et évitez de le laisser seul trop longtemps.' }] },
      { id: 'golden-retriever', nom: 'Golden Retriever', tags: 'Doux, joueur, sociable', emoji: '🦮', intro: 'Le Golden Retriever est l\'un des chiens les plus sociables et affectueux. Il adore les enfants, les autres animaux et les inconnus.', stats: { sociabilite: 10, activite: 8, independance: 2, entretien: 6 }, gardienInfo: 'Le Golden est très facile à garder : il accepte tout le monde avec enthousiasme. Attention à la suralimentation (gourmandise excessive). Il nécessite des sorties quotidiennes et adore l\'eau.', sections: [{ titre: 'Sociabilité', contenu: 'S\'entend avec tous — enfants, chats, autres chiens. Idéal pour une famille. Ne convient pas comme chien de garde.' }, { titre: 'Activité', contenu: '1h30 de sortie par jour minimum. Adore nager, rapporter des objets et les jeux collectifs.' }] },
      { id: 'border-collie', nom: 'Border Collie', tags: 'Intelligent, hyperactif, sensible', emoji: '🐩', intro: 'Considéré comme le chien le plus intelligent au monde, le Border Collie a besoin d\'une stimulation mentale et physique intense pour s\'épanouir.', stats: { sociabilite: 7, activite: 10, independance: 4, entretien: 5 }, gardienInfo: 'Le Border Collie est un chien exigeant. Sans stimulation suffisante, il développe des comportements obsessionnels (tourner en rond, fixer les lumières). Il est très sensible aux émotions humaines.', sections: [{ titre: 'Stimulation mentale', contenu: 'Jeux d\'intelligence, agility, travail de flair obligatoires. Une simple promenade ne suffit pas.' }, { titre: 'Sensibilité', contenu: 'Très sensible aux changements de routine et de ton de voix. Parlez-lui calmement et évitez les conflits en sa présence.' }] },
      { id: 'labrador', nom: 'Labrador', tags: 'Gourmand, joueur, facile', emoji: '🐕', intro: 'Le Labrador est un chien jovial, facile à vivre et toujours de bonne humeur. C\'est l\'une des races les plus populaires au monde.', stats: { sociabilite: 10, activite: 7, independance: 3, entretien: 5 }, gardienInfo: 'Surveillez attentivement les repas : le Labrador mange tout ce qu\'il trouve et peut s\'empoisonner facilement. Ne le laissez pas accès à la nourriture sans surveillance.', sections: [{ titre: 'Alimentation', contenu: 'Très gourmand, respectez strictement les rations. Ne cédez pas aux regards suppliants — l\'obésité est un problème fréquent de la race.' }, { titre: 'Activité', contenu: 'Sorties quotidiennes de 1h. Adore nager et jouer à rapporter. Bon caractère avec tous les animaux.' }] },
      { id: 'chihuahua', nom: 'Chihuahua', tags: 'Courageux, territorial, vif', emoji: '🐕', intro: 'Le plus petit chien du monde compense sa petite taille par une grande personnalité. Courageux jusqu\'à l\'imprudence, il est très attaché à son maître.', stats: { sociabilite: 5, activite: 5, independance: 4, entretien: 3 }, gardienInfo: 'Ne vous fiez pas à sa taille : le Chihuahua peut être territorial et mordre si il se sent menacé. Il a froid rapidement — prévoyez un manteau si nécessaire. Fragile des os, évitez les chutes.', sections: [{ titre: 'Fragilité', contenu: 'Très sensible au froid. Os fragiles — ne jamais le laisser sauter de surfaces hautes seul. Surveiller avec les jeunes enfants.' }, { titre: 'Tempérament', contenu: 'Très loyal à son maître, méfiant des inconnus. Donnez-lui le temps de s\'habituer à vous avant tout contact.' }] },
    ],
  },
  {
    id: 'chat',
    nom: 'Chat',
    nomComplet: 'Le Chat',
    categorie: 'chats',
    tags: 'Indépendant, curieux',
    emoji: '🐈',
    description: 'Animal indépendant qui apprécie son espace et la routine.',
    intro: 'Indépendant et curieux, le chat s\'adapte bien à la garde à domicile mais exige que ses habitudes soient respectées.',
    stats: { sociabilite: 5, activite: 5, independance: 9, entretien: 4 },
    gardienInfo: 'Le chat tolère bien la solitude mais doit retrouver son environnement habituel intact. Ne déplacez pas ses affaires, respectez ses heures de repas et laissez-lui accès à ses zones de repos. Évitez de le forcer au contact : attendez qu\'il vienne à vous.',
    sections: [
      { titre: 'Alimentation', contenu: 'Le chat est un carnivore strict. Respectez ses horaires et ses marques habituelles. Proposez croquettes et/ou pâtées selon ses habitudes. L\'eau doit être propre et changée quotidiennement — beaucoup de chats préfèrent une fontaine à eau.' },
      { titre: 'Litière', contenu: 'Nettoyez la litière au minimum une fois par jour. Un chat peut refuser de l\'utiliser si elle est sale. Gardez-la dans son emplacement habituel et utilisez le même type de litière.' },
      { titre: 'Exercice et jeu', contenu: 'Proposez des sessions de jeu de 10 à 15 minutes avec une canne à plumes ou une balle. Les chats d\'intérieur ont particulièrement besoin de stimulation. Assurez-vous qu\'il a accès à des zones en hauteur pour observer.' },
      { titre: 'Santé', contenu: 'Vérifiez l\'état des yeux, des oreilles et du pelage chaque jour. Signalez tout changement d\'appétit, vomissement ou comportement inhabituel. Les chats dissimulent souvent leur douleur.' },
      { titre: 'Signaux de stress', contenu: 'Un chat stressé se cache, arrête de se toiletter ou au contraire se lèche à l\'excès, grogne ou fait ses besoins hors de la litière. Respectez son besoin d\'espace et de calme.' },
    ],
    sousEspeces: [
      { id: 'persan', nom: 'Persan', tags: 'Calme, sédentaire, câlin', emoji: '🐈', intro: 'Le Persan est le chat le plus placide qui soit. Il préfère les environnements calmes et les caresses aux jeux turbulents.', stats: { sociabilite: 6, activite: 2, independance: 6, entretien: 9 }, gardienInfo: 'Le Persan nécessite un brossage quotidien pour éviter les nœuds. Ses yeux pleurent souvent — essuyez-les chaque matin avec une compresse. Évitez les environnements bruyants et stressants.', sections: [{ titre: 'Entretien du pelage', contenu: 'Brossage quotidien obligatoire. Sans entretien, des nœuds douloureux se forment rapidement. Prévoyez 10 minutes par jour.' }, { titre: 'Alimentation', contenu: 'Croquettes plates adaptées à sa morphologie (museau court). Eau disponible en permanence.' }] },
      { id: 'siamois', nom: 'Siamois', tags: 'Vocal, sociable, curieux', emoji: '🐈', intro: 'Le Siamois est le chat le plus expressif et vocal. Il communique constamment et déteste la solitude.', stats: { sociabilite: 9, activite: 7, independance: 3, entretien: 3 }, gardienInfo: 'Le Siamois peut devenir très bruyant si laissé seul. Interagissez régulièrement avec lui — conversations, jeux, câlins. Il souffre énormément de l\'isolement.', sections: [{ titre: 'Interaction', contenu: 'Parlez-lui : il vous répondra. Sessions de jeu quotidiennes nécessaires. Supporte mieux la présence d\'un autre chat que la solitude.' }, { titre: 'Tempérament', contenu: 'Peut être jaloux et exclusif. Respectez ses limites mais ne l\'ignorez pas.' }] },
      { id: 'maine-coon', nom: 'Maine Coon', tags: 'Doux géant, joueur, adaptable', emoji: '🐈', intro: 'Le plus grand des chats domestiques est aussi l\'un des plus doux. Le Maine Coon est sociable, joueur et s\'adapte facilement.', stats: { sociabilite: 8, activite: 7, independance: 5, entretien: 7 }, gardienInfo: 'Malgré sa grande taille (6-8 kg), le Maine Coon est très doux. Brossage 2-3 fois par semaine. Il adore jouer avec l\'eau.', sections: [{ titre: 'Entretien', contenu: 'Semi-long poil nécessitant un brossage régulier, surtout derrière les oreilles et sous les aisselles.' }, { titre: 'Personnalité', contenu: 'S\'entend bien avec les chiens et les enfants. Reste joueur toute sa vie.' }] },
      { id: 'british-shorthair', nom: 'British Shorthair', tags: 'Tranquille, indépendant, affectueux', emoji: '🐈', intro: 'Ronronnant et placide, le British Shorthair est parfait pour une garde sereine. Il est affectueux sans être collant.', stats: { sociabilite: 6, activite: 3, independance: 8, entretien: 3 }, gardienInfo: 'Très facile à garder. Il n\'exige pas d\'attention constante mais apprécie les câlins en fin de journée. Peu actif, surveiller son poids.', sections: [{ titre: 'Facilité', contenu: 'L\'un des chats les plus faciles à garder. Routine alimentaire à respecter, litière à nettoyer quotidiennement.' }, { titre: 'Activité', contenu: 'Peu sportif — proposer quelques séances de jeu pour éviter la prise de poids.' }] },
    ],
  },
  {
    id: 'lapin',
    nom: 'Lapin',
    nomComplet: 'Le Lapin',
    categorie: 'rongeurs',
    tags: 'Discret, herbivore',
    emoji: '🐇',
    description: 'Animal calme et affectueux qui a besoin d\'espace pour courir.',
    intro: 'Doux et discret, le lapin est un animal de compagnie attachant qui nécessite une alimentation adaptée et de l\'espace pour s\'ébattre.',
    stats: { sociabilite: 6, activite: 5, independance: 6, entretien: 5 },
    gardienInfo: 'Le lapin est fragile au stress. Manipulez-le avec douceur en le soutenant toujours par le postérieur. Ne le soulevez jamais par les oreilles. Assurez-vous qu\'il dispose de foin à volonté — c\'est la base de son alimentation.',
    sections: [
      { titre: 'Alimentation', contenu: 'Le foin doit représenter 80% de son alimentation et être disponible à volonté. Complétez avec des légumes frais (persil, basilic, feuilles de chou) et une petite quantité de granulés. Évitez les fruits en excès et jamais d\'iceberg ni de rhubarbe.' },
      { titre: 'Logement et espace', contenu: 'Le lapin a besoin de courir plusieurs heures par jour hors de sa cage. Sécurisez la pièce (câbles électriques, plantes toxiques). Sa litière doit être propre quotidiennement.' },
      { titre: 'Manipulation', contenu: 'Approchez-vous toujours au niveau du sol. Soutenez le corps entier lors de la prise en main. Un lapin qui se débat peut se fracturer la colonne vertébrale : posez-le immédiatement.' },
      { titre: 'Santé', contenu: 'Surveillez la consistance des crottes (molles = problème digestif) et la consommation de foin. Un lapin qui n\'a pas mangé depuis 6h nécessite une consultation vétérinaire urgente.' },
      { titre: 'Signaux de stress', contenu: 'Le lapin stressé se cache, grince des dents, frappe le sol de ses pattes arrière (thump) ou refuse tout contact. Respectez son rythme et évitez les bruits forts.' },
    ],
    sousEspeces: [
      { id: 'belier', nom: 'Bélier', tags: 'Doux, sociable, grandes oreilles', emoji: '🐇', intro: 'Le lapin Bélier se reconnaît à ses grandes oreilles tombantes. Très doux et sociable, il supporte bien la manipulation.', stats: { sociabilite: 8, activite: 4, independance: 5, entretien: 5 }, gardienInfo: 'Ses grandes oreilles sont fragiles — ne tirez jamais dessus. Brossage régulier nécessaire pour les races à long poil.', sections: [{ titre: 'Manipulation', contenu: 'Très tolérant. Soutenir le corps entier lors de la prise en main.' }, { titre: 'Entretien', contenu: 'Vérifier les oreilles régulièrement (accumulation de cire). Brossage hebdomadaire.' }] },
      { id: 'nain-hollande', nom: 'Nain de Hollande', tags: 'Petit, vif, espiègle', emoji: '🐇', intro: 'Le plus petit des lapins domestiques est aussi l\'un des plus énergiques. Vif et curieux, il adore explorer.', stats: { sociabilite: 7, activite: 7, independance: 6, entretien: 3 }, gardienInfo: 'Malgré sa petite taille, il a besoin d\'espace pour courir. Très rapide — surveillez les sorties de cage.', sections: [{ titre: 'Activité', contenu: 'Besoin de courir plusieurs heures par jour hors cage malgré sa petite taille.' }, { titre: 'Alimentation', contenu: 'Foin à volonté + légumes frais. Petite quantité de granulés suffisante.' }] },
      { id: 'angora', nom: 'Angora', tags: 'Doux, soyeux, entretien intensif', emoji: '🐇', intro: 'Le lapin Angora possède un pelage laineux extraordinaire qui nécessite un entretien quotidien rigoureux.', stats: { sociabilite: 6, activite: 4, independance: 6, entretien: 10 }, gardienInfo: 'Brossage quotidien obligatoire pour éviter les nœuds et les ingestions de poils. La toison doit être tondue tous les 3 mois.', sections: [{ titre: 'Entretien', contenu: 'Brossage quotidien de 15 minutes minimum. Sans entretien, formation de feutrine douloureuse.' }, { titre: 'Santé', contenu: 'Très sensible aux boules de poils dans le tube digestif. Donner régulièrement de la papaye ou de l\'ananas frais.' }] },
    ],
  },
  {
    id: 'rongeur',
    nom: 'Rongeur',
    nomComplet: 'Le Rongeur',
    categorie: 'rongeurs',
    tags: 'Nocturne, petit espace',
    emoji: '🐹',
    description: 'Petit animal discret, souvent nocturne, facile à entretenir.',
    intro: 'Discret et autonome, le rongeur (hamster, cochon d\'Inde, gerbille) est idéal pour une garde calme mais demande des soins quotidiens réguliers.',
    stats: { sociabilite: 4, activite: 6, independance: 7, entretien: 4 },
    gardienInfo: 'La plupart des rongeurs sont nocturnes et actifs la nuit. Ne les réveillez pas en journée — cela génère un stress important. Vérifiez la nourriture, l\'eau et l\'état de la litière chaque jour même si l\'animal ne se montre pas.',
    sections: [
      { titre: 'Alimentation', contenu: 'Granulés spécifiques à l\'espèce, légumes frais en petite quantité (carotte, concombre), eau fraîche renouvelée quotidiennement. Les cochons d\'Inde ont besoin de vitamine C (persil, poivron).' },
      { titre: 'Logement', contenu: 'La cage doit être propre avec de la litière fraîche. Évitez les courants d\'air et la lumière directe du soleil. Une roue de course silencieuse est indispensable pour les hamsters.' },
      { titre: 'Manipulation', contenu: 'Certains rongeurs ne sont pas faits pour être manipulés fréquemment. Observez le comportement habituel et respectez-le. Ne forcez jamais un animal à sortir de son abri.' },
      { titre: 'Santé', contenu: 'Vérifiez les dents (elles poussent en continu), les ongles et l\'état général du pelage. Toute perte de poids, poil ébouriffé ou léthargie doit être signalée.' },
      { titre: 'Signaux de stress', contenu: 'Morsures, couinements fréquents, course en cercles, ou refus de nourriture indiquent un mal-être. Réduisez les interactions et augmentez les cachettes.' },
    ],
    sousEspeces: [
      { id: 'hamster-dore', nom: 'Hamster Doré', tags: 'Solitaire, nocturne, actif la nuit', emoji: '🐹', intro: 'Le hamster doré est le plus connu des rongeurs. Solitaire et nocturne, il est parfait pour une garde discrète.', stats: { sociabilite: 3, activite: 7, independance: 9, entretien: 3 }, gardienInfo: 'Ne jamais mettre deux hamsters dorés ensemble — ils se battent à mort. Nocturne : ne pas déranger en journée.', sections: [{ titre: 'Solitude', contenu: 'Animal strictement solitaire. Une cage par hamster.' }, { titre: 'Roue', contenu: 'Roue de course silencieuse indispensable — il court plusieurs kilomètres par nuit.' }] },
      { id: 'cochon-inde', nom: "Cochon d'Inde", tags: 'Sociable, vocal, herbivore', emoji: '🐹', intro: "Le cochon d'Inde est un rongeur très sociable qui communique par des sons variés et a besoin d'un congénère.", stats: { sociabilite: 8, activite: 5, independance: 5, entretien: 5 }, gardienInfo: "Idéalement gardé en duo. A besoin de vitamine C quotidiennement (persil, poivron). Apprécie les sorties supervisées.", sections: [{ titre: 'Vitamine C', contenu: 'Ne synthétise pas la vitamine C. Persil frais, poivron ou complément vitaminé quotidien.' }, { titre: 'Sociabilité', contenu: 'S\'ennuie seul. Interactions régulières importantes.' }] },
      { id: 'rat-domestique', nom: 'Rat Domestique', tags: 'Intelligent, joueur, affectueux', emoji: '🐀', intro: 'Le rat domestique est l\'un des rongeurs les plus intelligents. Très affectueux, il aime les interactions et peut apprendre des tours.', stats: { sociabilite: 9, activite: 8, independance: 4, entretien: 5 }, gardienInfo: 'Vit en groupe — jamais seul. Sorties quotidiennes recommandées. Peut apprendre à répondre à son prénom.', sections: [{ titre: 'Groupes', contenu: 'Minimum par 2. Seul, il déprime rapidement.' }, { titre: 'Stimulation', contenu: 'Jouets, tunnels, jeux d\'intelligence. Peut apprendre des tours simples.' }] },
    ],
  },
  {
    id: 'reptile',
    nom: 'Reptile',
    nomComplet: 'Le Reptile',
    categorie: 'reptiles',
    tags: 'Spécifique, terrarium',
    emoji: '🦎',
    description: 'Animal exigeant qui nécessite un environnement très contrôlé.',
    intro: 'Les reptiles sont des animaux ectothermes dont les besoins thermiques et d\'éclairage sont précis et non négociables. Une garde sérieuse demande une formation minimale.',
    stats: { sociabilite: 2, activite: 3, independance: 9, entretien: 8 },
    gardienInfo: 'Ne modifiez jamais les paramètres du terrarium (température, éclairage UV, hygrométrie) sans accord du propriétaire. Vérifiez le thermomètre et le point chaud deux fois par jour. En cas de panne d\'équipement, contactez immédiatement le propriétaire.',
    sections: [
      { titre: 'Alimentation', contenu: 'Suivez scrupuleusement le protocole du propriétaire (fréquence, taille des proies, supplément de vitamines/calcium). Les serpents peuvent rester sans manger plusieurs jours — ne forcez pas.' },
      { titre: 'Terrarium et température', contenu: 'Maintenez le gradient thermique indiqué (zone chaude / zone froide). Vérifiez le bon fonctionnement de la lampe UV et du thermostat deux fois par jour.' },
      { titre: 'Manipulation', contenu: 'Manipulez uniquement si le propriétaire vous y a autorisé. Lavez-vous les mains avant et après. Ne manipulez pas un reptile qui vient de manger (24-48h).' },
      { titre: 'Santé', contenu: 'Observez la respiration (sifflements = problème), les yeux (troubles lors de la mue), la peau et les excréments. Signalez toute anomalie au propriétaire sans délai.' },
      { titre: 'Signaux de stress', contenu: 'Bouche ouverte, posture défensive, tentatives de fuite répétées ou refus alimentaire prolongé sont des signaux d\'alerte. Réduisez les interactions.' },
    ],
    sousEspeces: [
      { id: 'gecko-leopard', nom: 'Gecko Léopard', tags: 'Docile, facile, nocturne', emoji: '🦎', intro: 'Le gecko léopard est le reptile de compagnie idéal pour les débutants. Docile et facile à manipuler.', stats: { sociabilite: 4, activite: 4, independance: 9, entretien: 6 }, gardienInfo: 'Nocturne. Vérifier température chaude (30°C) et froide (24°C) deux fois par jour. Nourrir aux insectes vivants.', sections: [{ titre: 'Alimentation', contenu: 'Grillons et vers de farine, saupoudrés de calcium. Nourrir tous les 2-3 jours.' }, { titre: 'Manipulation', contenu: 'Très tolérant à la manipulation une fois habitué. Idéal pour débuter avec les reptiles.' }] },
      { id: 'agame-barbu', nom: 'Agame Barbu', tags: 'Diurne, sociable, omnivore', emoji: '🦎', intro: "L'Agame Barbu est diurne et reconnaît son gardien. Il mange aussi bien des insectes que des légumes.", stats: { sociabilite: 6, activite: 5, independance: 7, entretien: 7 }, gardienInfo: 'Besoin de lampe UV-B puissante 12h/jour. Température chaude à 40-45°C obligatoire pour la digestion.', sections: [{ titre: 'Alimentation', contenu: 'Omnivore : 50% insectes (jeunes), 70% légumes (adultes). Calcium et vitamines essentiels.' }, { titre: 'UV-B', contenu: 'Lampe UV-B de qualité indispensable. Changer la lampe tous les 6 mois même si elle s\'allume encore.' }] },
      { id: 'tortue-eau', nom: 'Tortue d\'Eau', tags: 'Aquatique, active, longévive', emoji: '🐢', intro: 'La tortue d\'eau (slider à tempes rouges notamment) est semi-aquatique et nécessite un aquaterrarium spécialisé.', stats: { sociabilite: 3, activite: 5, independance: 8, entretien: 8 }, gardienInfo: 'L\'eau doit être filtrée et chauffée (24-26°C). Zone terrestre avec lampe chauffante nécessaire. Nettoyage régulier du bac.', sections: [{ titre: 'Aquaterrarium', contenu: 'Zone aquatique filtrée + zone terrestre chauffée. Volume d\'eau minimum 200L pour adulte.' }, { titre: 'Alimentation', contenu: 'Gamme variée : bâtonnets pour tortues, crevettes séchées, légumes feuillus.' }] },
    ],
  },
  {
    id: 'oiseau',
    nom: 'Oiseau',
    nomComplet: 'L\'Oiseau',
    categorie: 'oiseaux',
    tags: 'Vocal, volière',
    emoji: '🦜',
    description: 'Animal sociable et vocal qui a besoin d\'interaction et de stimulation.',
    intro: 'Vif et expressif, l\'oiseau de compagnie (perroquet, canari, perruche) est sensible à l\'ambiance du foyer et demande une présence régulière.',
    stats: { sociabilite: 8, activite: 7, independance: 4, entretien: 5 },
    gardienInfo: 'Les oiseaux sont très sensibles aux fumées, aérosols et huiles de cuisson surchauffées (PTFE) qui peuvent être mortels. Parlez-leur régulièrement — ils ont besoin d\'interactions vocales. Couvrez la cage le soir pour simuler la nuit.',
    sections: [
      { titre: 'Alimentation', contenu: 'Graines, granulés, légumes frais et fruits selon l\'espèce. Changez la nourriture et l\'eau chaque matin. Retirez les restes de fruits et légumes le soir.' },
      { titre: 'Environnement', contenu: 'La cage doit être dans une pièce lumineuse, loin des courants d\'air et des fenêtres en plein soleil. Maintenez une température stable entre 18 et 24°C. Évitez cuisine et salle de bain.' },
      { titre: 'Interaction et jeu', contenu: 'Les perroquets et perruches ont besoin de sorties de cage quotidiennes dans une pièce sécurisée. Proposez jouets et jeux. Parlez-leur, ils s\'en nourrissent.' },
      { titre: 'Santé', contenu: 'Observez la posture (oiseau gonflé = malade), les plumes, les excréments. Une respiration bruyante ou une perte d\'équilibre nécessite une consultation urgente.' },
      { titre: 'Signaux de stress', contenu: 'Plumage ébouriffé en permanence, automutilation (arrachage de plumes), cris excessifs ou refus de contact indiquent un stress. Maintenez la routine habituelle.' },
    ],
    sousEspeces: [
      { id: 'perruche', nom: 'Perruche', tags: 'Vive, sociale, bavarde', emoji: '🦜', intro: 'La perruche est l\'oiseau de compagnie le plus populaire. Vive et sociable, elle adore interagir et peut apprendre à parler.', stats: { sociabilite: 9, activite: 8, independance: 4, entretien: 4 }, gardienInfo: 'La perruche a besoin de sortir de sa cage au moins 1h par jour. Très sensible aux courants d\'air et aux fumées de cuisson.', sections: [{ titre: 'Sorties', contenu: 'Sortie quotidienne indispensable dans une pièce sécurisée. Fenêtres fermées, miroirs couverts.' }, { titre: 'Interaction', contenu: 'Parlez-lui régulièrement, proposez des jouets variés. Apprécie la musique douce.' }] },
      { id: 'perroquet-gris', nom: 'Perroquet Gris', tags: 'Intelligent, expressif, sensible', emoji: '🦜', intro: 'Le Perroquet Gris du Gabon peut avoir le vocabulaire d\'un enfant de 5 ans. Très sensible aux émotions humaines.', stats: { sociabilite: 9, activite: 7, independance: 3, entretien: 6 }, gardienInfo: 'Maintenez une routine stricte. Le Gris peut développer des phobies sous stress. Parlez-lui constamment et évitez les changements d\'environnement.', sections: [{ titre: 'Intelligence', contenu: 'Capable de comprendre le sens des mots. Besoin de stimulation intense : puzzles, apprentissage.' }, { titre: 'Anxiété', contenu: 'Peut arracher ses plumes si laissé seul trop longtemps. Radio ou TV pour compagnie sonore.' }] },
      { id: 'canari', nom: 'Canari', tags: 'Chanteur, discret, indépendant', emoji: '🐦', intro: 'Le canari enchante le foyer par son chant. Il demande peu d\'interactions directes et préfère être observé que manipulé.', stats: { sociabilite: 4, activite: 5, independance: 8, entretien: 3 }, gardienInfo: 'Ne nécessite pas de sorties hors cage. Nourrissez-le chaque matin, changez l\'eau, nettoyez le fond de cage. Évitez de le manipuler.', sections: [{ titre: 'Entretien', contenu: 'Nourriture fraîche et eau quotidiennes. Bain d\'eau tiède 2 fois par semaine.' }, { titre: 'Chant', contenu: 'Cage couverte la nuit pour favoriser un meilleur chant le matin.' }] },
      { id: 'pigeon', nom: 'Pigeon', tags: 'Fidèle, paisible, peu exigeant', emoji: '🕊️', intro: 'Le pigeon domestique est un oiseau étonnamment affectueux et intelligent, souvent méconnu comme animal de compagnie.', stats: { sociabilite: 7, activite: 5, independance: 6, entretien: 4 }, gardienInfo: 'Le pigeon reconnaît son gardien. Il a besoin d\'espace pour voler. Évitez les mouvements brusques — il prend facilement peur.', sections: [{ titre: 'Alimentation', contenu: 'Mélange de graines (blé, maïs, pois). Gravier fin disponible. Eau fraîche quotidienne.' }, { titre: 'Logement', contenu: 'Volière spacieuse minimum 2m². Perchoirs à différentes hauteurs.' }] },
      { id: 'pie', nom: 'Pie', tags: 'Curieuse, vive, intelligente', emoji: '🐦', intro: 'La Pie bavarde est l\'un des oiseaux les plus intelligents au monde, capable de se reconnaître dans un miroir.', stats: { sociabilite: 7, activite: 9, independance: 5, entretien: 6 }, gardienInfo: 'La Pie adore collectionner des objets brillants. Grande volière et stimulation intense nécessaires. Peut être bruyante et territoriale.', sections: [{ titre: 'Stimulation', contenu: 'Jeux de puzzles, objets à manipuler, cachettes de nourriture. Sous-stimulée, elle devient destructrice.' }, { titre: 'Alimentation', contenu: 'Omnivore : graines, insectes, viande cuite, fruits et légumes. Alimentation très variée.' }] },
      { id: 'cacatoes', nom: 'Cacatoès', tags: 'Expressif, bruyant, câlin', emoji: '🦜', intro: 'Le Cacatoès est expressif, attachant et très bruyant. Il a besoin d\'interactions constantes et souffre énormément de la solitude.', stats: { sociabilite: 10, activite: 8, independance: 2, entretien: 7 }, gardienInfo: 'Prévoyez plusieurs heures d\'interaction quotidienne. Ses cris peuvent être très forts — informez les voisins avant la garde.', sections: [{ titre: 'Interaction', contenu: 'Plusieurs heures de contact direct par jour. Jeux, câlins, apprentissage. Ne peut pas être ignoré.' }, { titre: 'Entretien', contenu: 'Produit de la poussière de plume (allergie possible). Aérez régulièrement.' }] },
    ],
  },
  {
    id: 'poisson',
    nom: 'Poisson',
    nomComplet: 'Le Poisson',
    categorie: 'nac',
    tags: 'Aquarium, discret',
    emoji: '🐠',
    description: 'Animal discret dont l\'entretien de l\'aquarium est primordial.',
    intro: 'Calme et contemplatif, le poisson d\'aquarium demande peu d\'interactions directes mais un entretien rigoureux de son milieu de vie.',
    stats: { sociabilite: 1, activite: 4, independance: 10, entretien: 7 },
    gardienInfo: 'L\'aquarium est un écosystème fragile. Ne modifiez jamais la chimie de l\'eau, la température ou l\'éclairage sans accord du propriétaire. Nourrissez selon le protocole exact — trop de nourriture pollue l\'eau et tue les poissons.',
    sections: [
      { titre: 'Alimentation', contenu: 'Une à deux fois par jour, en petite quantité (tout doit être consommé en 2 minutes). Les poissons sont victimes de suralimentation plus que de sous-alimentation.' },
      { titre: 'Aquarium', contenu: 'Vérifiez la température de l\'eau (thermomètre), le bon fonctionnement du filtre et de l\'éclairage chaque jour. Ne touchez pas aux équipements sans instructions précises.' },
      { titre: 'Qualité de l\'eau', contenu: 'Une eau trouble ou malodorante est un signal d\'alarme. Contactez le propriétaire immédiatement. Ne faites pas de changement d\'eau partiel sans protocole établi.' },
      { titre: 'Santé', contenu: 'Observez les comportements natatoires (nage latérale, surface en permanence) et l\'aspect physique (taches, nageoires abîmées). Signalez tout poisson immobile au fond.' },
      { titre: 'Signaux de stress', contenu: 'Comportement erratique, frottement contre les décors, regroupement en surface ou isolement d\'un poisson grégaire sont des signaux à surveiller.' },
    ],
  },
  {
    id: 'herisson',
    nom: 'Hérisson',
    nomComplet: 'Le Hérisson',
    categorie: 'nac',
    tags: 'NAC, nocturne',
    emoji: '🦔',
    description: 'Animal nocturne solitaire et spécifique, réservé aux gardiens expérimentés.',
    intro: 'Le hérisson est un NAC (Nouvel Animal de Compagnie) fascinant mais exigeant, nocturne et solitaire, qui nécessite une expérience avec les animaux atypiques.',
    stats: { sociabilite: 3, activite: 6, independance: 8, entretien: 6 },
    gardienInfo: 'Le hérisson est strictement nocturne : ne le réveillez pas en journée. Il peut se mettre en boule en présence d\'inconnus — c\'est normal et ne doit pas être interprété comme un refus de contact. Laissez-lui le temps de s\'habituer à votre odeur.',
    sections: [
      { titre: 'Alimentation', contenu: 'Croquettes pour chats (sans céréales), insectes (grillons, vers de farine) en complément, et petites quantités de fruits. L\'eau doit être disponible en permanence.' },
      { titre: 'Logement', contenu: 'Une cage spacieuse avec une roue de course (obligatoire pour son bien-être), des cachettes et de la litière. Température entre 22 et 26°C — en dessous de 18°C, il entre en hibernation forcée dangereuse.' },
      { titre: 'Manipulation', contenu: 'Approchez lentement la main, laissez-le renifler. Portez des gants épais si besoin. Ne le forcez jamais à se dérouler.' },
      { titre: 'Santé', contenu: 'Surveillez le poids (amaigrissement rapide = problème), l\'état des piquants et des pattes. Une hibernation hors saison est une urgence vétérinaire.' },
      { titre: 'Signaux de stress', contenu: 'Position en boule permanente même après acclimatation, perte d\'appétit, tressautement (Wobbly Hedgehog Syndrome). Contactez le propriétaire si ces signes durent plus de 48h.' },
    ],
  },
  {
    id: 'furet',
    nom: 'Furet',
    nomComplet: 'Le Furet',
    categorie: 'nac',
    tags: 'Joueur, NAC',
    emoji: '🦦',
    description: 'Animal joueur et curieux qui adore explorer et interagir.',
    intro: 'Espiègle et affectueux, le furet est un NAC très actif qui réclame de l\'attention, de l\'espace et des interactions quotidiennes.',
    stats: { sociabilite: 8, activite: 9, independance: 3, entretien: 6 },
    gardienInfo: 'Le furet dort entre 14 et 18h par jour mais est très actif lors de ses phases d\'éveil. Il DOIT sortir de sa cage au moins 2h par jour dans une pièce sécurisée (il glisse sous tous les meubles). Son odeur musquée est normale.',
    sections: [
      { titre: 'Alimentation', contenu: 'Croquettes spéciales furet riches en protéines animales, disponibles à volonté (il gère sa quantité). L\'eau doit être changée quotidiennement. Évitez fruits, légumes et sucres.' },
      { titre: 'Logement et sorties', contenu: 'Cage spacieuse à plusieurs niveaux avec hamacs (il adore dormir suspendu). Sorties quotidiennes obligatoires de 2h minimum dans une pièce furet-proof (câbles, trous cachés).' },
      { titre: 'Jeu et interaction', contenu: 'Le furet adore les tunnels, les balles et les cachettes. Il mord doucement pour jouer — c\'est normal. Sessions de jeu minimum 30 minutes.' },
      { titre: 'Santé', contenu: 'Les furets sont sensibles à la grippe humaine — évitez tout contact si vous êtes enrhumé. Signalez tout vomissement, diarrhée noire ou léthargie.' },
      { titre: 'Signaux de stress', contenu: 'Un furet stressé se cache, mord fort (différent du jeu), perd ses poils par plaques ou développe de la diarrhée. Respectez son besoin d\'espace et maintenez la routine.' },
    ],
  },
  {
    id: 'tortue',
    nom: 'Tortue',
    nomComplet: 'La Tortue',
    categorie: 'reptiles',
    tags: 'Lente, longévité',
    emoji: '🐢',
    description: 'Animal paisible et longévif aux besoins environnementaux précis.',
    intro: 'Symbole de longévité, la tortue est un animal calme aux besoins environnementaux très précis. Elle peut vivre plus de 50 ans et mérite un soin attentif.',
    stats: { sociabilite: 2, activite: 2, independance: 8, entretien: 7 },
    gardienInfo: 'La tortue terrestre ne nage pas — ne la mettez jamais dans l\'eau profonde. Elle a besoin de lumière UV chaque jour pour synthétiser la vitamine D3. Sans éclairage adapté, elle développe des carences osseuses graves.',
    sections: [
      { titre: 'Alimentation', contenu: 'Feuilles variées (pissenlit, trèfle, plantain), légumes verts feuillus. Pas de fruits ni de nourriture pour chats. Saupoudrez le repas de calcium 2x par semaine. Eau fraîche dans un plat peu profond.' },
      { titre: 'Environnement', contenu: 'Terrarium avec zone chaude (30-32°C), zone fraîche (22-24°C) et lampe UV-B allumée 10-12h par jour. Substrat adapté pour creuser.' },
      { titre: 'Manipulation', contenu: 'Tenez la tortue à deux mains, à l\'horizontale. Évitez de la retourner. Lavez-vous les mains après contact (salmonelle possible).' },
      { titre: 'Santé', contenu: 'Nez coulant, bouche ouverte, yeux fermés ou carapace molle sont des signes d\'urgence. Ne tentez pas de provoquer l\'hibernation — contactez le propriétaire.' },
      { titre: 'Signaux de stress', contenu: 'Refus alimentaire prolongé, tentatives répétées de s\'échapper, léthargie totale. Ces signes peuvent aussi annoncer une hibernation — vérifiez la température et informez le propriétaire.' },
    ],
  },
]

export const CATEGORIES = [
  { id: 'tous',     label: 'Tous' },
  { id: 'chiens',   label: 'Chiens' },
  { id: 'chats',    label: 'Chats' },
  { id: 'rongeurs', label: 'Rongeurs' },
  { id: 'reptiles', label: 'Reptiles' },
  { id: 'oiseaux',  label: 'Oiseaux' },
  { id: 'nac',      label: 'NAC' },
] as const
