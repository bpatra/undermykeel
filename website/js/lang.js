var localizedStrings = {
    High_tide: {
        'en': 'High tide',
        'fr': 'Pleine mer'
    },
    Low_tide: {
        'en': 'Low tide',
        'fr': 'Basse mer'
    },
    Atmospheric_pressure: {
        'en': 'Atmospheric pressure',
        'fr': 'Pression atmosphérique'
    },
    Tidal: {
        'en': 'Tidal',
        'fr': 'Marnage'
    },

    Display: {
        'en':'Get tide curve',
        'fr':'Afficher la courbe de marée'
    },

    Back: {
        'en':'Back',
        'fr':'Retour'
    },

    Method:{
        'en':"Depth computed using the <a href='http://fr.wikipedia.org/wiki/Calcul_de_mar%C3%A9e'>SHOM harmonic approximation method.</a>",
        'fr':"Hauteur d'eau calculée par la <a href='http://fr.wikipedia.org/wiki/Calcul_de_mar%C3%A9e'>méthode d'approximation harmonique du SHOM</a>."
    },

    Disclaimer:{
        'en':'The end-user must not rely on this application as a primary source for sailing.',
        'fr':" L'utilisateur ne doit pas se baser sur cette application comme source principale de navigation."
    },

    Depth:{
        'en':'depth',
        'fr':'hauteur'
    },
	
	TideParameters:{
        'en':'Parameters for the current tide',
        'fr':'Paramètres de la marée en cours'
    },
	
	LocalData:{
        'en':'Local data for the current tide',
        'fr':'Données du lieu pour la marée en cours'
    },
	
	LocalDataRef:{
        'en':'Local data for a reference tide',
        'fr':'Données du lieu pour une marée de référence'
    },
	
	LocalTime:{
		'en':'Time',
		'fr':'Heure'
	},
	
	LocalDepth:{
		'en':'Depth',
		'fr':'Hauteur d\'eau'
	},
	
	CoeffCheckBox:{
		'en':'Compute using a reference tide',
		'fr':'Calcul à partir d\'une marée de référence'
	},
	
	Coeffs:{
		'en':'Coefficient',
		'fr':'Coefficient'
	},
	
	DepthAtLowTide:{
		'en':'Depth at low tide',
		'fr':"Hauteur d'eau à basse mer"
	}
};

var localizedErrors = {
    TidalPos: {
        'en': 'Tidal must be positive.',
        'fr': 'Le marnage doit être positif.'
    },
    SupiciousTideDur: {
        'en': 'Suspicious tide duration.',
        'fr': 'La durée de marée est supecte.'
    },
    Tidal: {
        'en': 'Invalid tidal value.',
        'fr': 'Valeur de marnage invalide'
    },
    HighTideInvalid: {
        'en': 'Invalid high tide time.',
        'fr': 'Heure de pleine mer invalide.'
    },
    LowTideInvalid: {
        'en': 'Invalid low tide time.',
        'fr': 'Heure de basse mer invalide.'
    },
    InvalidPressure: {
        'en': 'Invalid atmospheric pressure.',
        'fr': 'Pression atmosphérique invalide.'
    },
    InvalidPointDataTime: {
        'en': 'Invalid point data time.',
        'fr': 'Donnée ponctuelle horaire invalide.'
    },
    InvalidPointDataValue: {
        'en': 'Invalid point data sea level.',
        'fr': "Donnée ponctuelle de hauteur d'eau invalide."
    },
	
	 InvalidCoefficient: {
        'en': 'Invalid tide coefficient (must be a number between 30 and 150).',
        'fr': "Coefficient de marée invalide (doit être un nombre entre 30 et 150)."
    },
	
	PortraitNotSupported:{
		'en': 'Display in portrait mode is not supported, resize your window or turn your device and reload the page',
		'fr' : "L'affichage en mode portrait n'est pas supporté, redimensionez votre fenêtre ou tournez votre appareil et rechargez la page"
	}

};

