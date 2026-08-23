(function () {
    'use strict';

    const config = window.ROUTE_CONFIG || {};
    const usesServerProtectedData = config.serverProtected === true;
    let stops = usesServerProtectedData
        ? []
        : (Array.isArray(config.stops) ? config.stops : []);
    const fallbackImage = config.fallbackImage || 'images/funchal-hero.webp.jpg';
    let defaultDuration = config.defaultDuration || '';
    const routeName = config.name || 'route';
    const routeKey = (config.key || routeName).toString().trim().toLowerCase();
    const accessStorageKey = 'access_' + routeKey;
    const progressStorageKey = 'progress_' + routeKey;
    const labels = config.labels || {};
    const urls = config.urls || {};
    const pageLanguage = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    const localizedFallbacks = {
        en: {
            navigateHere: 'Open in Google Maps',
            openingRoute: 'Opening route...',
            openingReturnRoute: 'Opening route back...',
            lockedTitle: 'Route locked',
            lockedText: 'This route is available after purchase on this device.',
            unlockRoute: 'Unlock route',
            stopLabel: 'STOP',
            stopFallback: 'Stop',
            usefulStop: 'A useful stop on this Funchal route.',
            suggestedDuration: 'Suggested duration:',
            defaultDuration: '30 minutes',
            durationHereSuffix: 'here',
            backToShip: 'Back to Ship',
            returnRoute: 'View route back',
            finishRoute: 'FINISH ROUTE',
            nextStop: 'NEXT STOP ->',
            audioLoading: 'LOADING...',
            audioPause: 'PAUSE',
            audioPlay: 'PLAY AUDIO',
            openingMaps: 'Opening Google Maps',
            mapsWillOpen: "Google Maps will guide you **on foot** to your next stop.",
            mapsWillOpenReturn: "Google Maps will guide you **on foot** back to the port.",
            mapsReturnFull: "When you arrive, use your phone's **Back** button or gesture to return to CruiseStop and continue your route.",
            mapsReturnFullReturn: "When you arrive, use your phone's **Back** button or gesture to return to CruiseStop and check your timer.",
            mapsBackButton: 'Use your back button',
            mapsReturnText: 'to return to your route.',
            cancel: 'Cancel',
            openMaps: 'Open Google Maps →',
            mapUnavailable: 'Map unavailable offline',
            showMap: 'Show on Map',
            hideMap: 'Hide Map',
            returnBy: 'Return by:',
            buffer45: '+45 min buffer',
            buffer30: '+30 min buffer',
            buffer15: '+15 min buffer',
            timeUp: 'Time is up. Return to ship soon.'
        },
        pt: {
            navigateHere: 'Abrir no Google Maps',
            openingRoute: 'A abrir rota...',
            openingReturnRoute: 'A abrir o caminho de regresso...',
            lockedTitle: 'Rota bloqueada',
            lockedText: 'Esta rota fica disponível neste dispositivo depois da compra.',
            unlockRoute: 'Começar por €4,99',
            stopLabel: 'PARAGEM',
            stopFallback: 'Paragem',
            usefulStop: 'Uma paragem útil nesta rota pelo Funchal.',
            suggestedDuration: 'Tempo sugerido:',
            defaultDuration: '30 minutos',
            durationHereSuffix: 'aqui',
            backToShip: 'Regresso ao navio',
            returnRoute: 'Ver caminho de regresso',
            finishRoute: 'TERMINAR ROTA',
            nextStop: 'Continuar rota',
            audioLoading: 'A CARREGAR...',
            audioPause: 'PAUSA',
            audioPlay: 'OUVIR ÁUDIO',
            openingMaps: 'A abrir o Google Maps',
            mapsWillOpen: 'O Google Maps vai guiá-lo **a pé** até à próxima paragem.',
            mapsWillOpenReturn: 'O Google Maps vai guiá-lo **a pé** de volta ao porto.',
            mapsReturnFull: 'Quando chegar, use o botão ou gesto **Voltar** do telemóvel para regressar à CruiseStop e continuar a sua rota.',
            mapsReturnFullReturn: 'Quando chegar, use o botão ou gesto **Voltar** do telemóvel para regressar à CruiseStop e consultar o seu temporizador.',
            mapsBackButton: 'Use o botão Voltar',
            mapsReturnText: 'para regressar à sua rota.',
            cancel: 'Cancelar',
            openMaps: 'Abrir Google Maps →',
            mapUnavailable: 'Mapa indisponível offline',
            showMap: 'Ver no mapa',
            hideMap: 'Ocultar mapa',
            returnBy: 'Regresso recomendado até às',
            buffer45: 'Margem prevista: +45 min',
            buffer30: 'Margem prevista: +30 min',
            buffer15: 'Margem prevista: +15 min',
            timeUp: 'O tempo terminou. Regresse ao navio em breve.'
        },
        de: {
            navigateHere: 'In Google Maps \u00f6ffnen',
            openingRoute: 'Route wird ge\u00f6ffnet...',
            lockedTitle: 'Route gesperrt',
            lockedText: 'Diese Route ist nach dem Kauf auf diesem Gerät verfügbar.',
            unlockRoute: 'Für €4,99 starten',
            stopLabel: 'STOPP',
            stopFallback: 'Stopp',
            usefulStop: 'Ein sinnvoller Stopp auf dieser Funchal-Route.',
            suggestedDuration: 'Empfohlene Zeit:',
            defaultDuration: '30 Minuten',
            durationHereSuffix: 'hier',
            finishRoute: 'ROUTE BEENDEN',
            nextStop: 'NÄCHSTER STOPP ->',
            audioLoading: 'WIRD GELADEN...',
            audioPause: 'PAUSE',
            audioPlay: 'AUDIO ABSPIELEN',
            openingMaps: 'Google Maps wird geöffnet',
            mapsWillOpen: 'Google Maps führt Sie **zu Fuß** zum nächsten Stopp.',
            mapsWillOpenReturn: 'Google Maps führt Sie **zu Fuß** zurück zum Hafen.',
            mapsReturnFull: 'Nutzen Sie nach der Ankunft die **Zurück**-Taste oder -Geste Ihres Handys, um zu CruiseStop zurückzukehren und Ihre Route fortzusetzen.',
            mapsReturnFullReturn: 'Nutzen Sie nach der Ankunft die **Zurück**-Taste oder -Geste Ihres Handys, um zu CruiseStop zurückzukehren und Ihren Timer zu prüfen.',
            mapsBackButton: 'Nutze die Zurück-Taste',
            mapsReturnText: 'um zur Route zurückzukehren.',
            cancel: 'Abbrechen',
            openMaps: 'Google Maps öffnen →',
            mapUnavailable: 'Karte offline nicht verfügbar',
            showMap: 'Auf Karte anzeigen',
            hideMap: 'Karte ausblenden',
            returnBy: 'Zurück bis:',
            buffer45: '+45 Min. Puffer',
            buffer30: '+30 Min. Puffer',
            buffer15: '+15 Min. Puffer',
            timeUp: 'Die Zeit ist um. Geh bald zurück zum Schiff.'
        },
        fr: {
            navigateHere: 'Ouvrir dans Google Maps',
            openingRoute: "Ouverture de l'itin\u00e9raire...",
            lockedTitle: 'Route verrouillée',
            lockedText: 'Cette route est disponible après achat sur cet appareil.',
            unlockRoute: 'Commencer pour €4,99',
            stopLabel: 'ARRÊT',
            stopFallback: 'Arrêt',
            usefulStop: 'Un arrêt utile sur cette route de Funchal.',
            suggestedDuration: 'Temps conseillé :',
            defaultDuration: '30 minutes',
            durationHereSuffix: 'ici',
            finishRoute: 'TERMINER LA ROUTE',
            nextStop: 'ARRÊT SUIVANT ->',
            audioLoading: 'CHARGEMENT...',
            audioPause: 'PAUSE',
            audioPlay: "ÉCOUTER L'AUDIO",
            openingMaps: 'Ouverture de Google Maps',
            mapsWillOpen: "Google Maps va vous guider **à pied** jusqu'au prochain arrêt.",
            mapsWillOpenReturn: "Google Maps va vous guider **à pied** jusqu'au port.",
            mapsReturnFull: "À votre arrivée, utilisez le bouton ou le geste **Retour** de votre téléphone pour revenir sur CruiseStop et continuer votre parcours.",
            mapsReturnFullReturn: "À votre arrivée, utilisez le bouton ou le geste **Retour** de votre téléphone pour revenir sur CruiseStop et consulter votre minuteur.",
            mapsBackButton: 'Utilisez le bouton retour',
            mapsReturnText: 'pour revenir à votre route.',
            cancel: 'Annuler',
            openMaps: 'Ouvrir Google Maps →',
            mapUnavailable: 'Carte indisponible hors ligne',
            showMap: 'Voir sur la carte',
            hideMap: 'Masquer la carte',
            returnBy: 'Retour avant :',
            buffer45: '+45 min de marge',
            buffer30: '+30 min de marge',
            buffer15: '+15 min de marge',
            timeUp: 'Le temps est écoulé. Retournez bientôt au navire.'
        },
        nl: {
            navigateHere: 'Openen in Google Maps',
            openingRoute: 'Route openen...',
            lockedTitle: 'Route vergrendeld',
            lockedText: 'Deze route is beschikbaar na aankoop op dit toestel.',
            unlockRoute: 'Route ontgrendelen',
            stopLabel: 'STOP',
            stopFallback: 'Stop',
            usefulStop: 'Een nuttige stop op deze Funchal-route.',
            suggestedDuration: 'Aanbevolen tijd:',
            defaultDuration: '30 minuten',
            durationHereSuffix: 'hier',
            finishRoute: 'ROUTE AFRONDEN',
            nextStop: 'VOLGENDE STOP ->',
            audioLoading: 'AUDIO LADEN...',
            audioPause: 'PAUZE',
            audioPlay: 'AUDIO AFSPELEN',
            openingMaps: 'Google Maps wordt geopend',
            mapsWillOpen: 'Google Maps begeleidt u **te voet** naar de volgende stop.',
            mapsWillOpenReturn: 'Google Maps begeleidt u **te voet** terug naar de haven.',
            mapsReturnFull: 'Gebruik na aankomst de **Terug**-knop of -beweging van uw telefoon om terug te gaan naar CruiseStop en uw route voort te zetten.',
            mapsReturnFullReturn: 'Gebruik na aankomst de **Terug**-knop of -beweging van uw telefoon om terug te gaan naar CruiseStop en uw timer te bekijken.',
            mapsBackButton: 'Gebruik de terugknop',
            mapsReturnText: 'om terug te keren naar je route.',
            cancel: 'Annuleren',
            openMaps: 'Google Maps openen →',
            mapUnavailable: 'Kaart offline niet beschikbaar',
            showMap: 'Toon op kaart',
            hideMap: 'Verberg kaart',
            returnBy: 'Terug om:',
            buffer45: '+45 min buffer',
            buffer30: '+30 min buffer',
            buffer15: '+15 min buffer',
            timeUp: 'De tijd is om. Ga snel terug naar het schip.'
        }
    };
    if (!defaultDuration) {
        defaultDuration = (localizedFallbacks[pageLanguage] && localizedFallbacks[pageLanguage].defaultDuration) || '30 minutes';
    }

    let currentStopIndex = 0;
    let audioProgress = 0;
    let audioInterval = null;
    let audioState = 'idle';
    let timerInterval = null;
    let currentSeconds = 0;
    let isPaused = false;
    let isRunning = false;
    let isFinishing = false;

    const audioDuration = Number(config.audioDurationSeconds) || 30;
    const totalSeconds = Number(config.totalSeconds) || 5 * 60 * 60;

    function label(key, fallback) {
        return labels[key] || (localizedFallbacks[pageLanguage] && localizedFallbacks[pageLanguage][key]) || fallback;
    }

    function pageUrl(key, fallback) {
        return urls[key] || fallback;
    }

    function setText(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }

    function splitWhyText(value) {
        const text = (value || '').toString().trim();
        if (!text) return [];

        const explicitItems = text
            .split(/\n|•/)
            .map((item) => item.trim())
            .filter(Boolean);

        if (explicitItems.length > 1) {
            return explicitItems;
        }

        const sentenceItems = text.match(/[^.!?]+[.!?]+(?:["'”’])?/g) || [];
        const cleanedSentences = sentenceItems.map((item) => item.trim()).filter(Boolean);

        return cleanedSentences.length > 1 ? cleanedSentences : [text];
    }

    function setWhyBullets(selector, value) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.textContent = '';

        splitWhyText(value).forEach((item) => {
            const bullet = document.createElement('span');
            bullet.className = 'stop-why-bullet';
            bullet.textContent = item;
            element.appendChild(bullet);
        });
    }

    function getCurrentStop() {
        return stops[currentStopIndex] || {};
    }

    function vibrateTap() {
        if ('vibrate' in navigator) navigator.vibrate(45);
    }

    function getAudioButton() {
        return document.getElementById('audioBtn') || null;
    }
    function readStoredJson(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || 'null');
        } catch (err) {
            return null;
        }
    }

    function protectedRouteCacheKey() {
        return `protected_route_${routeKey}_${pageLanguage}`;
    }

    function clearProtectedRouteAccess() {
        localStorage.removeItem(accessStorageKey);
        localStorage.removeItem(protectedRouteCacheKey());
    }

    function hasProtectedCredentials(access) {
        const expiry = Number(access?.expiry || 0);

        return Boolean(
            access &&
            expiry &&
            Date.now() < expiry &&
            /^[a-f0-9]{32}$/i.test(String(access.accessToken || '')) &&
            /^[A-Za-z0-9_-]{16,128}$/.test(String(access.deviceToken || ''))
        );
    }

    function applyProtectedStops(routeStops) {
        if (!Array.isArray(routeStops) || !routeStops.length) {
            return false;
        }

        stops = routeStops;
        config.stops = routeStops;
        return true;
    }

    function readProtectedRouteCache(access) {
        const cached = readStoredJson(protectedRouteCacheKey());
        const expiry = Number(cached?.expiry || 0);

        if (
            !cached ||
            cached.route !== routeKey ||
            cached.language !== pageLanguage ||
            !expiry ||
            Date.now() >= expiry ||
            cached.accessToken !== access.accessToken ||
            cached.deviceToken !== access.deviceToken ||
            !Array.isArray(cached.stops) ||
            !cached.stops.length
        ) {
            return null;
        }

        return cached;
    }

    function saveProtectedRouteCache(access, expiry) {
        localStorage.setItem(
            protectedRouteCacheKey(),
            JSON.stringify({
                route: routeKey,
                language: pageLanguage,
                expiry,
                accessToken: access.accessToken,
                deviceToken: access.deviceToken,
                stops
            })
        );
    }

    async function validateAndLoadProtectedRoute() {
        const access = readStoredJson(accessStorageKey);

        if (!hasProtectedCredentials(access)) {
            clearProtectedRouteAccess();
            return false;
        }

        try {
            const response = await fetch('/route-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    route: routeKey,
                    language: pageLanguage,
                    accessToken: access.accessToken,
                    deviceToken: access.deviceToken
                })
            });

            let data = null;

            try {
                data = await response.json();
            } catch (err) {
                data = null;
            }

            if (!response.ok) {
                if ([400, 403, 404, 410].includes(response.status)) {
                    clearProtectedRouteAccess();
                    return false;
                }

                const cached = readProtectedRouteCache(access);

                if (cached && applyProtectedStops(cached.stops)) {
                    return true;
                }

                return false;
            }

            if (
                !data ||
                data.ok !== true ||
                data.route !== routeKey ||
                data.language !== pageLanguage ||
                !applyProtectedStops(data.stops)
            ) {
                return false;
            }

            const serverExpiry = Number(data.accessExpiresAt || access.expiry);

            if (!serverExpiry || Date.now() >= serverExpiry) {
                clearProtectedRouteAccess();
                return false;
            }

            const updatedAccess = {
                expiry: serverExpiry,
                accessToken: access.accessToken,
                deviceToken: access.deviceToken
            };

            localStorage.setItem(
                accessStorageKey,
                JSON.stringify(updatedAccess)
            );

            saveProtectedRouteCache(updatedAccess, serverExpiry);

            return true;

        } catch (err) {
            const cached = readProtectedRouteCache(access);

            if (cached && applyProtectedStops(cached.stops)) {
                return true;
            }

            return false;
        }
    }

    function hasValidRouteAccess() {
        const access = readStoredJson(accessStorageKey);
        const expiry = Number(access?.expiry || 0);

        if (!access || !expiry || Date.now() >= expiry) {
            localStorage.removeItem(accessStorageKey);

            if (usesServerProtectedData) {
                localStorage.removeItem(protectedRouteCacheKey());
            }

            return false;
        }

        if (usesServerProtectedData) {
            return hasProtectedCredentials(access) && stops.length > 0;
        }

        return true;
    }

    function renderBottomNav() {
        return '';
    }

    function showLockedRoute() {
        localStorage.setItem('cruisestop_intended_route', routeKey);
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="route-column" style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem;">
                <section class="stop-card" style="width:100%;max-width:420px;text-align:center;padding:2rem 1.25rem;">
                    <div style="font-size:2.5rem;margin-bottom:0.75rem;">🔒</div>
                    <h1 style="color:#062f73;font-size:1.35rem;margin-bottom:0.5rem;">${label('lockedTitle', 'Route locked')}</h1>
                    <p style="color:#061f4c;font-size:0.95rem;line-height:1.5;margin-bottom:1.25rem;font-weight:800;">
                        ${label('lockedText', 'This route is available after purchase on this device.')}
                    </p>
                    <button class="btn btn-primary" type="button" onclick="window.location.href='${pageUrl('routes', 'index.html#routes')}'">${label('unlockRoute', 'Unlock route')}</button>
                </section>
            </div>
            ${renderBottomNav('routes')}
        `;
    }

    function requireRouteAccess() {
        if (hasValidRouteAccess()) return true;
        showLockedRoute();
        return false;
    }

    function saveProgress() {
        if (isFinishing || !hasValidRouteAccess()) return;

        localStorage.setItem(progressStorageKey, JSON.stringify({
            route: routeKey,
            currentStopIndex,
            currentSeconds,
            isRunning,
            isPaused,
            savedAt: Date.now()
        }));
    }

    function restoreProgress() {
        const progress = readStoredJson(progressStorageKey);
        if (!progress) return;

        const stopIndex = Number(progress.currentStopIndex);
        if (Number.isFinite(stopIndex) && stops.length) {
            currentStopIndex = Math.min(Math.max(0, Math.floor(stopIndex)), stops.length - 1);
        }

        const seconds = Number(progress.currentSeconds);
        currentSeconds = Number.isFinite(seconds) ? Math.min(Math.max(0, Math.floor(seconds)), totalSeconds) : 0;

        const savedAt = Number(progress.savedAt || 0);
        if (progress.isRunning && !progress.isPaused && savedAt > 0) {
            const elapsedSinceSave = Math.max(0, Math.floor((Date.now() - savedAt) / 1000));
            currentSeconds = Math.min(currentSeconds + elapsedSinceSave, totalSeconds);
        }

        isPaused = Boolean(progress.isPaused);
        isRunning = false;
    }

    function renderTimerDisplay() {
        const remainingSeconds = Math.max(0, totalSeconds - currentSeconds);
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        setText('.time-remaining-label', label('backToShip', 'Back to Ship'));
        setText(
            '#timeRemaining',
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
        updateCruiseTimerInfo(remainingSeconds);
    }

    function previousStopLabel() {
        const fallback = {
            en: '\u2190 PREVIOUS STOP',
            pt: '\u2190 PARAGEM ANTERIOR',
            de: '\u2190 VORHERIGER STOPP',
            fr: '\u2190 ARR\u00caT PR\u00c9C\u00c9DENT',
            nl: '\u2190 VORIGE STOP'
        };

        return label('previousStop', fallback[pageLanguage] || fallback.en);
    }

    function ensurePreviousStopButton() {
        let button = document.getElementById('previousStopBtn');
        if (button) return button;

        const title = document.getElementById('stop-title');
        if (!title || !title.parentNode) return null;

        button = document.createElement('button');
        button.id = 'previousStopBtn';
        button.type = 'button';
        button.onclick = previousStop;
        button.style.cssText = [
            'display:none',
            'align-items:center',
            'justify-content:flex-start',
            'width:max-content',
            'max-width:100%',
            'margin:2px 0 8px',
            'padding:5px 2px',
            'border:0',
            'background:transparent',
            'color:#062f73',
            'font:800 0.78rem/1.2 Inter,system-ui,sans-serif',
            'letter-spacing:.02em',
            'cursor:pointer',
            'touch-action:manipulation'
        ].join(';');

        title.parentNode.insertBefore(button, title);
        return button;
    }
    function updateStopDisplay() {
        if (!stops.length) {
            return;
        }

        const stop = getCurrentStop();
        const stopNumber = currentStopIndex + 1;
        const widgets = document.querySelectorAll('.stop-header, .landscape-image-widget, .stop-description, .stop-why, .btn-next');

        widgets.forEach((widget) => {
            widget.style.transition = 'none';
            widget.style.opacity = '0';
            widget.style.transform = 'translateY(16px)';
        });

        window.setTimeout(() => {
            setText('.stop-step', `${label('stopLabel', 'STOP')} ${stopNumber}`);
            const displayTotal = getDisplayStopCount();
            setText('.stop-counter', `${Math.min(stopNumber, displayTotal)}/${displayTotal}`);
            const previousBtn = ensurePreviousStopButton();
            if (previousBtn) {
                previousBtn.textContent = previousStopLabel();
                previousBtn.setAttribute('aria-label', previousStopLabel());
                previousBtn.style.display = currentStopIndex > 0 ? 'inline-flex' : 'none';
            }
            // total-stops-indicator removed
            setText('#stop-title', stop.name || `${label('stopFallback', 'Stop')} ${stopNumber}`);
            setText('#stopDescription', stop.description || '');
            setWhyBullets('#stopWhyText', stop.whyText || config.defaultWhyText || label('usefulStop', 'A useful stop on this Funchal route.'));
            setText('#stopDuration', `${label('suggestedDuration', 'Suggested duration:')} ${stop.duration || defaultDuration}`);
            const pageLang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
            const hereSuffixes = { de: 'hier', fr: 'ici', nl: 'hier', pt: 'aqui' };
            const hereSuffix = label('durationHereSuffix', hereSuffixes[pageLang] || 'here');
            setText('#stopSpend', `⏱ ${stop.duration || defaultDuration} ${hereSuffix}`);

            const image = document.getElementById('stopImage');
            if (image) {
                image.dataset.fallbackApplied = '';
                image.onerror = () => {
                    if (image.dataset.fallbackApplied === '1') return;
                    image.dataset.fallbackApplied = '1';
                    image.src = fallbackImage;
                };
                image.src = stop.image || fallbackImage;
                image.alt = stop.name || `${label('stopFallback', 'Stop')} ${stopNumber}`;
            }

            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) {
                if (currentStopIndex === stops.length - 1) {
                    nextBtn.textContent = `✓ ${label('finishRoute', 'FINISH ROUTE')}`;
                    nextBtn.onclick = finishRoute;
                } else {
                    nextBtn.textContent = `${label('nextStop', 'NEXT STOP ->').replace('->', '→')}`;
                    nextBtn.onclick = nextStop;
                }
            }

            const mapsBtn = document.getElementById('mapsBtn');
            if (mapsBtn) {
                const navLabel = label('navigateHere', 'Open in Google Maps');
                mapsBtn.textContent = navLabel.includes('📍') ? navLabel : `📍 ${navLabel}`;
            }

            const returnRouteBtn = document.getElementById('returnRouteBtn');
            if (returnRouteBtn) {
                returnRouteBtn.textContent = label('returnRoute', 'View route back');
            }

            // Update map pin if open
            if (mapOpen) updateMapPosition();

            widgets.forEach((widget, index) => {
                window.setTimeout(() => {
                    widget.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    widget.style.opacity = '1';
                    widget.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 200);
    }

    function nextStop() {
        if (currentStopIndex < stops.length - 1) {
            vibrateTap();
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) nextBtn.classList.add('is-loading');
            document.body.classList.add('route-transitioning');
            window.setTimeout(() => {
                currentStopIndex += 1;
                saveProgress();
                updateStopDisplay();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.body.classList.remove('route-transitioning');
                if (nextBtn) nextBtn.classList.remove('is-loading');
            }, 160);
        }
    }

    function previousStop() {
        if (currentStopIndex > 0) {
            currentStopIndex -= 1;
            saveProgress();
            updateStopDisplay();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function finishRoute() {
        vibrateTap();
        isFinishing = true;

        // Record completed route and date
        const completedRoutes = JSON.parse(localStorage.getItem('cruisestop_completed_routes') || '[]');
        const customerEmail = localStorage.getItem('cruisestop_customer_email');
        
        const completionRecord = {
            route: routeName,
            completedDate: new Date().toISOString(),
            completedDateFormatted: new Date().toLocaleDateString('pt-PT'),
            timestamp: Date.now(),
            customerEmail: customerEmail || null
        };
        
        // Add to completed routes (avoid duplicates)
        const existingIndex = completedRoutes.findIndex(r => r.route === routeName);
        if (existingIndex >= 0) {
            completedRoutes[existingIndex] = completionRecord;
        } else {
            completedRoutes.push(completionRecord);
        }
        
        localStorage.setItem('cruisestop_completed_routes', JSON.stringify(completedRoutes));
        localStorage.removeItem(progressStorageKey);
        
        // Redirect to feedback page with route parameter (per language)
        const feedbackLang = (document.documentElement.lang || 'en').slice(0, 2);
        const feedbackPage = ['pt', 'fr', 'de'].includes(feedbackLang)
            ? `feedback_${feedbackLang}.html`
            : 'feedback.html';
        window.location.href = `${feedbackPage}?route=${routeName}&key=${routeKey}`;
    }

    function setAudioButton(html, disabled) {
        const audioBtn = getAudioButton();
        if (!audioBtn) {
            return;
        }

        audioBtn.innerHTML = html;
        audioBtn.disabled = Boolean(disabled);
    }

    function playAudio() {
        const audioBtn = getAudioButton();
        if (!audioBtn) {
            return;
        }

        if (audioState === 'idle') {
            audioState = 'loading';
            setAudioButton(label('audioLoading', 'LOADING...'), true);
            audioBtn.classList.add('loading');

            window.setTimeout(() => {
                audioState = 'playing';
                audioBtn.classList.remove('loading');
                setAudioButton(label('audioPause', 'PAUSE'), false);
                startAudioProgress();
            }, 1000);
            return;
        }

        if (audioState === 'playing') {
            pauseAudio();
            return;
        }

        if (audioState === 'paused') {
            audioState = 'playing';
            setAudioButton(label('audioPause', 'PAUSE'), false);
            startAudioProgress();
        }
    }

    function pauseAudio() {
        if (audioState !== 'playing') {
            return;
        }

        audioState = 'paused';
        setAudioButton(label('audioPlay', 'PLAY AUDIO'), false);
        stopAudioProgress();
    }

    function startAudioProgress() {
        stopAudioProgress();
        updateProgressBar();

        audioInterval = window.setInterval(() => {
            audioProgress += 0.1;
            updateProgressBar();

            if (audioProgress >= audioDuration) {
                audioProgress = 0;
                audioState = 'idle';
                stopAudioProgress();

                const audioBtn = getAudioButton();
                if (audioBtn) {
                    audioBtn.style.setProperty('--progress-width', '0%');
                }
                setAudioButton(label('audioPlay', 'PLAY AUDIO'), false);
            }
        }, 100);
    }

    function updateProgressBar() {
        const audioBtn = getAudioButton();
        if (!audioBtn) {
            return;
        }

        const progress = Math.min((audioProgress / audioDuration) * 100, 100);
        audioBtn.style.setProperty('--progress-width', `${progress}%`);
    }

    function stopAudioProgress() {
        if (audioInterval) {
            window.clearInterval(audioInterval);
            audioInterval = null;
        }
    }

    function openInGoogleMaps() {
        vibrateTap();
        const mapsBtn = document.getElementById('mapsBtn');
        const originalMapsLabel = mapsBtn ? mapsBtn.textContent : '';
        if (mapsBtn) {
            mapsBtn.classList.add('is-opening');
            mapsBtn.textContent = label('openingRoute', '📍 Opening route...');
            window.setTimeout(() => {
                mapsBtn.classList.remove('is-opening');
                if (originalMapsLabel) mapsBtn.textContent = originalMapsLabel;
            }, 1400);
        }
        const stop = getCurrentStop();
        showMapsPopup(buildMapsNavigationUrl(stop));
    }

    // Total apresentado ao utilizador: exclui a paragem final de regresso ao
    // porto. NAO altera stops.length, que continua a comandar a navegacao.
    function getDisplayStopCount() {
        if (stops.length < 2) {
            return stops.length;
        }
        const last = stops[stops.length - 1] || {};
        const text = `${last.name || ''} ${last.title || ''} ${last.mapQuery || ''}`;
        return /(port|porto|ship|navio|cruise)/i.test(text) ? stops.length - 1 : stops.length;
    }

    function getReturnStop() {
        const explicitReturnStop = [...stops].reverse().find((stop) => {
            const text = `${stop.name || ''} ${stop.title || ''} ${stop.mapQuery || ''}`;
            return /(port|porto|ship|navio|cruise)/i.test(text);
        });

        return explicitReturnStop || {
            name: 'Funchal Cruise Port',
            mapQuery: 'Funchal Cruise Port, Madeira',
            lat: 32.641239,
            lng: -16.916657
        };
    }

    function openReturnRoute() {
        vibrateTap();
        const returnBtn = document.getElementById('returnRouteBtn');
        const originalLabel = returnBtn ? returnBtn.textContent : '';
        if (returnBtn) {
            returnBtn.classList.add('is-opening');
            returnBtn.textContent = label('openingReturnRoute', 'Opening route back...');
            window.setTimeout(() => {
                returnBtn.classList.remove('is-opening');
                if (originalLabel) returnBtn.textContent = originalLabel;
            }, 1400);
        }

        showMapsPopup(buildMapsNavigationUrl(getReturnStop()), true);
    }

    function buildMapsNavigationUrl(stop) {
        const isIOS     = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isAndroid = /Android/.test(navigator.userAgent);

        // Build the navigation URL
        let url;
        if (stop && stop.lat && stop.lng) {
            if (isIOS) {
                url = `http://maps.apple.com/?daddr=${stop.lat},${stop.lng}&dirflg=w`;
            } else if (isAndroid) {
                url = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=walking&dir_action=navigate`;
            } else {
                url = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=walking&dir_action=navigate`;
            }
        } else {
            const query = (stop && stop.mapQuery) || `${(stop && stop.name) || 'Funchal'}, Madeira, Portugal`;
            url = isIOS
                ? `http://maps.apple.com/?q=${encodeURIComponent(query)}&dirflg=w`
                : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=walking&dir_action=navigate`;
        }

        return url;
    }

    function showMapsPopup(url, isReturn) {
        // Remove existing popup if any
        const existing = document.getElementById('mapsPopup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'mapsPopup';
        var intro = isReturn
            ? label('mapsWillOpenReturn', 'Google Maps will guide you **on foot** back to the port.')
            : label('mapsWillOpen', 'Google Maps will guide you **on foot** to your next stop.');
        var backLine = isReturn
            ? label('mapsReturnFullReturn', "When you arrive, use your phone's **Back** button or gesture to return to CruiseStop and check your timer.")
            : label('mapsReturnFull', "When you arrive, use your phone's **Back** button or gesture to return to CruiseStop and continue your route.");
        var bold = function (s) {
            return String(s).replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:800; color:#062f73;">$1</strong>');
        };

        popup.innerHTML = `
            <div id="mapsPopupOverlay" style="
                position:fixed; inset:0; background:rgba(0,0,0,0.6);
                z-index:9999; display:flex; align-items:flex-end;
                justify-content:center; padding:1rem;
                animation:fadeIn 0.2s ease;
            ">
                <div style="
                    background:#ffffff; border-radius:20px; padding:26px 22px 22px;
                    width:100%; max-width:420px; text-align:center;
                    box-shadow:0 -4px 30px rgba(0,0,0,0.4);
                    animation:slideUp 0.25s ease;
                ">
                    <div style="font-size:42px; line-height:1; margin-bottom:14px;">🗺️</div>
                    <h3 style="color:#062f73; font-size:25px; line-height:1.25; font-weight:800; margin:0 0 18px;">
                        ${label('openingMaps', 'Opening Google Maps')}
                    </h3>
                    <p style="color:#08295d; font-size:19px; line-height:1.5; margin:0 0 18px; text-align:left;">
                        ${bold(intro)}
                    </p>
                    <p style="color:#08295d; font-size:19px; line-height:1.5; margin:0 0 24px; text-align:left;">
                        ${bold(backLine)}
                    </p>
                    <div style="display:flex; gap:12px;">
                        <button onclick="document.getElementById('mapsPopup').remove()" style="
                            flex:1; min-height:52px; padding:14px 10px; border-radius:50px;
                            background:#ffffff; border:2px solid #062b67;
                            color:#062b67; font-size:17px; font-weight:700; cursor:pointer;
                        ">${label('cancel', 'Cancel')}</button>
                        <button onclick="document.getElementById('mapsPopup').remove(); window.location.href='${url}';" style="
                            flex:1.5; min-height:52px; padding:14px 10px; border-radius:50px;
                            background:#FFC107; border:none;
                            color:#062b67; font-size:18px; font-weight:800; cursor:pointer;
                        ">${label('openMaps', 'Open Google Maps →')}</button>
                    </div>
                </div>
            </div>
            <style>
                @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
                @keyframes slideUp { from { transform:translateY(40px); opacity:0 } to { transform:translateY(0); opacity:1 } }
            </style>
        `;
        // Close on backdrop click
        popup.querySelector('#mapsPopupOverlay').addEventListener('click', function(e) {
            if (e.target === this) popup.remove();
        });

        document.body.appendChild(popup);
    }

    // ── Mini Map (Leaflet) ────────────────────────────────────────────────────────
    let leafletMap = null;
    let mapMarker  = null;
    let mapOpen    = false;

    function toggleMap() {
        const container = document.getElementById('mapContainer');
        const btn       = document.getElementById('mapToggleBtn');
        if (!container || !btn) return;

        // Check online status before opening map
        if (!mapOpen && !navigator.onLine) {
            btn.textContent = label('mapUnavailable', 'Map unavailable offline');
            btn.style.opacity = '0.5';
            btn.style.cursor = 'default';
            window.setTimeout(() => {
                btn.textContent = label('showMap', 'Show on Map');
                btn.style.opacity = '';
                btn.style.cursor = '';
            }, 2500);
            return;
        }

        if (!mapOpen) {
            container.style.display = 'block';
            btn.textContent = label('hideMap', 'Hide Map');
            mapOpen = true;

            const stop = getCurrentStop();

            if (!leafletMap && stop.lat && stop.lng) {
                leafletMap = L.map('leafletMap', { zoomControl: true, attributionControl: false })
                    .setView([stop.lat, stop.lng], 16);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);

                const icon = L.divIcon({
                    className: '',
                    html: '<div style="background:#FFC107;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',
                    iconSize: [16, 16], iconAnchor: [8, 8]
                });
                mapMarker = L.marker([stop.lat, stop.lng], { icon })
                    .addTo(leafletMap)
                    .bindPopup(`<b>${stop.name}</b>`)
                    .openPopup();
            } else if (leafletMap) {
                updateMapPosition();
            }

            window.setTimeout(() => leafletMap && leafletMap.invalidateSize(), 100);

        } else {
            container.style.display = 'none';
            btn.textContent = label('showMap', 'Show on Map');
            mapOpen = false;
        }
    }

    // Hide map and update button when going offline
    window.addEventListener('offline', () => {
        if (mapOpen) {
            const container = document.getElementById('mapContainer');
            const btn       = document.getElementById('mapToggleBtn');
            if (container) container.style.display = 'none';
            if (btn) btn.textContent = label('showMap', 'Show on Map');
            mapOpen = false;
        }
        const btn = document.getElementById('mapToggleBtn');
        if (btn) {
            btn.textContent = label('mapUnavailable', 'Map unavailable offline');
            btn.style.opacity = '0.5';
            btn.style.cursor = 'default';
            btn.disabled = true;
        }
    });

    // Restore button when back online
    window.addEventListener('online', () => {
        const btn = document.getElementById('mapToggleBtn');
        if (btn) {
            btn.textContent = label('showMap', 'Show on Map');
            btn.style.opacity = '';
            btn.style.cursor = '';
            btn.disabled = false;
        }
    });

    function updateMapPosition() {
        if (!leafletMap || !mapMarker) return;
        const stop = getCurrentStop();
        if (!stop.lat || !stop.lng) return;

        const icon = L.divIcon({
            className: '',
            html: '<div style="background:#FFC107;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',
            iconSize: [16, 16], iconAnchor: [8, 8]
        });
        mapMarker.setLatLng([stop.lat, stop.lng]);
        mapMarker.setIcon(icon);
        mapMarker.setPopupContent(`<b>${stop.name}</b>`).openPopup();
        leafletMap.setView([stop.lat, stop.lng], 16);
    }

    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');

        button.querySelectorAll('.ripple').forEach((existingRipple) => existingRipple.remove());
        button.appendChild(ripple);

        window.setTimeout(() => ripple.remove(), 600);
    }

    function addRippleEffects() {
        document.querySelectorAll('.btn, .footer-nav-item').forEach((button) => {
            button.addEventListener('click', createRipple);
        });
    }

    function goToStart() {
        window.location.href = pageUrl('home', 'index.html');
    }

    function goToRoute() {
        if (config.summaryUrl) {
            window.location.href = config.summaryUrl;
            return;
        }

        window.alert(`${routeName} route overview`);
    }

    function goToStops() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function goToHelp() {
        window.location.href = pageUrl('help', 'help.html');
    }

    function startTimer() {
        if (isRunning) {
            return;
        }

        isRunning = true;
        isPaused = false;
        timerInterval = window.setInterval(updateTimer, 1000);

        const timerWidget = document.getElementById('timerWidget');
        if (timerWidget) {
            timerWidget.style.display = 'block';
        }

        renderTimerDisplay();
        saveProgress();
    }
    function updateTimer() {
        if (isPaused) {
            return;
        }

        currentSeconds += 1;
        const remainingSeconds = totalSeconds - currentSeconds;

        if (remainingSeconds <= 0) {
            window.clearInterval(timerInterval);
            timerInterval = null;
            isRunning = false;
            currentSeconds = totalSeconds;
            setText('#timeRemaining', '00:00:00');
            saveProgress();
            showTimeUpNotification();
            return;
        }

        renderTimerDisplay();
        saveProgress();
    }

    function updateCruiseTimerInfo(remainingSeconds) {
        const timerDisplay = document.querySelector('.cruise-timer');
        const now = new Date();
        const returnTime = new Date(now.getTime() + remainingSeconds * 1000 - 45 * 60 * 1000);

        setText(
            '#returnTime',
            `${label('returnBy', 'Return by:')} ${String(returnTime.getHours()).padStart(2, '0')}:${String(returnTime.getMinutes()).padStart(2, '0')}`
        );

        if (!timerDisplay) {
            return;
        }

        timerDisplay.classList.remove('zone-green', 'zone-yellow', 'zone-red');

        if (remainingSeconds > 2 * 60 * 60) {
            timerDisplay.classList.add('zone-green');
            setText('#bufferBadge', label('buffer45', '+45 min buffer'));
        } else if (remainingSeconds > 60 * 60) {
            timerDisplay.classList.add('zone-yellow');
            setText('#bufferBadge', label('buffer30', '+30 min buffer'));
        } else {
            timerDisplay.classList.add('zone-red');
            setText('#bufferBadge', label('buffer15', '+15 min buffer'));
        }
    }

    function showTimeUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'route-notification';
        notification.textContent = label('timeUp', 'Time is up. Return to ship soon.');
        document.body.appendChild(notification);
        window.setTimeout(() => notification.remove(), 5000);
    }

    function handleKeyboardNavigation(event) {
        if (event.key === 'ArrowRight') {
            nextStop();
        } else if (event.key === 'ArrowLeft') {
            previousStop();
        } else if (event.key === ' ' && event.target === document.body) {
            event.preventDefault();
            playAudio();
        }
    }

    window.nextStop = nextStop;
    window.toggleMap = toggleMap;
    window.goToNextStop = nextStop;
    window.previousStop = previousStop;
    window.finishRoute = finishRoute;
    window.playAudio = playAudio;
    window.openInGoogleMaps = openInGoogleMaps;
    window.openReturnRoute = openReturnRoute;
    window.goToStart = goToStart;

    // Overview — goes to route summary page
    function goToOverview() {
        const summaryUrl = window.ROUTE_CONFIG?.summaryUrl || 'index.html';
        window.location.href = summaryUrl;
    }
    window.goToOverview = goToOverview;

    // Timer — scrolls to timer widget or shows it if hidden
    function goToTimer() {
        const timerWidget = document.getElementById('timerWidget');
        if (!timerWidget) return;
        timerWidget.style.display = 'block';
        saveProgress();
    }    window.goToTimer = goToTimer;
    window.goToRoute = goToRoute;
    window.goToStops = goToStops;
    window.goToHelp = goToHelp;

    function initMicroUX() {
        const whyBox = document.querySelector('.stop-why');
        if (whyBox) {
            whyBox.setAttribute('role', 'button');
            whyBox.setAttribute('tabindex', '0');
            const toggleWhy = () => whyBox.classList.toggle('is-expanded');
            whyBox.addEventListener('click', toggleWhy);
            whyBox.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleWhy();
                }
            });
        }

        const imageWidget = document.querySelector('.landscape-image-widget');
        if (imageWidget && !document.querySelector('.scroll-hint')) {
            const hint = document.createElement('div');
            hint.className = 'scroll-hint';
            hint.setAttribute('aria-hidden', 'true');
            hint.textContent = '↓';
            imageWidget.insertAdjacentElement('afterend', hint);
            window.setTimeout(() => hint.remove(), 7000);
        }

        const timerWidget = document.getElementById('timerWidget');
        if (timerWidget) {
            window.setInterval(() => {
                timerWidget.classList.add('timer-pulse');
                window.setTimeout(() => timerWidget.classList.remove('timer-pulse'), 190);
            }, 10000);
        }
    }

    function getResumeRouteCopy(stopNumber, totalStops) {
        const copies = {
            en: {
                title: 'Route in progress',
                text: `Your route is at Stop ${stopNumber} of ${totalStops}.`,
                continueLabel: 'CONTINUE ROUTE',
                restartLabel: 'RESTART FROM BEGINNING'
            },
            pt: {
                title: 'Rota em andamento',
                text: `A sua rota está na Paragem ${stopNumber} de ${totalStops}.`,
                continueLabel: 'CONTINUAR ROTA',
                restartLabel: 'RECOMEÇAR DO INÍCIO'
            },
            de: {
                title: 'Route läuft',
                text: `Ihre Route befindet sich bei Stopp ${stopNumber} von ${totalStops}.`,
                continueLabel: 'ROUTE FORTSETZEN',
                restartLabel: 'VON VORNE BEGINNEN'
            },
            fr: {
                title: 'Itinéraire en cours',
                text: `Votre itinéraire est à l’arrêt ${stopNumber} sur ${totalStops}.`,
                continueLabel: 'CONTINUER L’ITINÉRAIRE',
                restartLabel: 'RECOMMENCER DEPUIS LE DÉBUT'
            },
            nl: {
                title: 'Route bezig',
                text: `Je route staat bij stop ${stopNumber} van ${totalStops}.`,
                continueLabel: 'ROUTE VOORTZETTEN',
                restartLabel: 'OPNIEUW BEGINNEN'
            }
        };

        return copies[pageLanguage] || copies.en;
    }

    function askResumeOrRestart() {
        const progress = readStoredJson(progressStorageKey);
        if (!progress) return Promise.resolve('fresh');

        const storedIndex = Number(progress.currentStopIndex);
        const storedSeconds = Number(progress.currentSeconds);

        const hasProgress =
            (Number.isFinite(storedIndex) && storedIndex > 0) ||
            (Number.isFinite(storedSeconds) && storedSeconds > 0);

        if (!hasProgress) return Promise.resolve('continue');

        const safeIndex = Number.isFinite(storedIndex)
            ? Math.min(Math.max(0, Math.floor(storedIndex)), Math.max(0, stops.length - 1))
            : 0;

        const stopNumber = safeIndex + 1;
        const totalStops = getDisplayStopCount();
        const copy = getResumeRouteCopy(stopNumber, totalStops);

        return new Promise((resolve) => {
            const previousOverflow = document.body.style.overflow;

            const overlay = document.createElement('div');
            overlay.id = 'routeResumeOverlay';
            overlay.setAttribute('role', 'presentation');
            overlay.style.cssText = [
                'position:fixed',
                'inset:0',
                'z-index:99999',
                'display:flex',
                'align-items:center',
                'justify-content:center',
                'padding:20px',
                'background:rgba(6,31,76,.72)'
            ].join(';');

            const dialog = document.createElement('section');
            dialog.className = 'route-resume-dialog';
            dialog.setAttribute('role', 'dialog');
            dialog.setAttribute('aria-modal', 'true');
            dialog.setAttribute('aria-labelledby', 'routeResumeTitle');
            dialog.style.cssText = [
                'width:min(100%,390px)',
                'padding:26px 22px 22px',
                'border-radius:22px',
                'background:#ffffff',
                'box-shadow:0 24px 60px rgba(0,0,0,.28)',
                'text-align:center',
                'font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'
            ].join(';');

            const title = document.createElement('h2');
            title.id = 'routeResumeTitle';
            title.textContent = copy.title;
            title.style.cssText = [
                'margin:0 0 9px',
                'color:#062f73',
                'font-size:1.55rem',
                'line-height:1.1',
                'font-weight:900',
                'letter-spacing:-.025em'
            ].join(';');

            const text = document.createElement('p');
            text.textContent = copy.text;
            text.style.cssText = [
                'margin:0 0 22px',
                'color:#405876',
                'font-size:.98rem',
                'line-height:1.45',
                'font-weight:650'
            ].join(';');

            const continueBtn = document.createElement('button');
            continueBtn.type = 'button';
            continueBtn.className = 'route-resume-continue';
            continueBtn.textContent = copy.continueLabel;
            continueBtn.style.cssText = [
                'width:100%',
                'min-height:54px',
                'margin:0 0 10px',
                'padding:10px 16px',
                'border:2px solid #c98e00',
                'border-radius:15px',
                'background:#ffc400',
                'color:#062f73',
                'font-size:.95rem',
                'font-weight:900',
                'cursor:pointer',
                'touch-action:manipulation'
            ].join(';');

            const restartBtn = document.createElement('button');
            restartBtn.type = 'button';
            restartBtn.className = 'route-resume-restart';
            restartBtn.textContent = copy.restartLabel;
            restartBtn.style.cssText = [
                'width:100%',
                'min-height:50px',
                'padding:9px 16px',
                'border:2px solid #c6d3e5',
                'border-radius:15px',
                'background:#ffffff',
                'color:#0a3476',
                'font-size:.88rem',
                'font-weight:850',
                'cursor:pointer',
                'touch-action:manipulation'
            ].join(';');

            dialog.append(title, text, continueBtn, restartBtn);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            const close = (choice) => {
                document.body.style.overflow = previousOverflow;
                overlay.remove();
                resolve(choice);
            };

            continueBtn.addEventListener('click', () => close('continue'));

            restartBtn.addEventListener('click', () => {
                localStorage.removeItem(progressStorageKey);
                close('restart');
            });

            window.setTimeout(() => continueBtn.focus(), 50);
        });
    }
    document.addEventListener('DOMContentLoaded', async () => {
        if (usesServerProtectedData) {
            const app = document.getElementById('app');

            if (app) {
                app.style.visibility = 'hidden';
            }

            const accessGranted = await validateAndLoadProtectedRoute();

            if (app) {
                app.style.visibility = '';
            }

            if (!accessGranted) {
                showLockedRoute();
                return;
            }
        } else {
            if (!requireRouteAccess()) return;
        }

        const startMode = await askResumeOrRestart();

        if (startMode === 'continue') {
            restoreProgress();
        } else {
            currentStopIndex = 0;
            currentSeconds = 0;
            isPaused = false;
            isRunning = false;
        }

        updateStopDisplay();
        addRippleEffects();
        initMicroUX();
        document.addEventListener('keydown', handleKeyboardNavigation);
        window.addEventListener('beforeunload', saveProgress);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') saveProgress();
        });
        window.setTimeout(startTimer, 500);
    });
}());
