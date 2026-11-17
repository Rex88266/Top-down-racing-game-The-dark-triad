        let liv = 2;       // Antal liv som spelaren har
        let poang = 3;     // Antal poäng som spelaren har
        let dod = false;   // Visar om spelaren är död

        const restartbtn = document.getElementById("spelaIgen");
        restartbtn.addEventListener("click", function () {
            location.reload(); // Laddar om sidan när restart-knappen klickas
        });

        const healthDisplay = document.getElementById("liv");
        healthDisplay.textContent = "HEJ";
        alert("HEJ");
        //healthDisplay.textContent = "Liv: " + liv; // Visar initialt antal liv på sidan

        function kollision() {
            // Hanterar kollisioner och minskar antalet liv

            if (dod) return; // Gör ingenting om spelaren redan är död

            liv--; // Minskar antalet liv med 1

            // Uppdaterar antalet liv på sidan
            document.getElementById("liv").textContent =
                "Liv: " + liv;

            // Kontrollerar om spelaren har slut på liv
            if (liv <= 0) {
                dod = true;
                visaDodskarm();
            }
        }

        function passeratObjekt() {
            // Hanterar när spelaren passerar ett objekt

            if (dod) return; // Gör ingenting om spelaren är död

            poang++; // Ökar poängen med 1
            document.getElementById("poang-horn").textContent =
                "Poäng: " + poang;
        }

        function visaDodskarm() {
            // Visar dödskärmen och spelarens slutpoäng

            // Visar spelarens slutpoäng på dödskärmen
            document.getElementById("slutpoang").textContent = poang;

            // Gör dödskärmen synlig
            document.getElementById("dodskarm").style.display = "block";
        }