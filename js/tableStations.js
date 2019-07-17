async => {
		try {
			const response = await fetch("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=28739a9e4d6cd592b4a215b24a880460621ca811");
			if(response.ok) {
				const data = await response.json();
				return data;
			} else {
				console.error("Retour du serveur : ", response.status);
			}
		} catch (e) {
			console.log(e);
		}		
	}