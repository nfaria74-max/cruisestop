const ALLOWED_ORIGINS = new Set([
  "https://cruisestop.eu",
  "https://www.cruisestop.eu",
  "https://cruisestop-pwa.pages.dev",
  "http://localhost:4174",
  "http://127.0.0.1:4174",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
]);

function corsHeaders(request, methods) {
  const origin = request.headers.get("Origin");
  const allowOrigin =
    origin && ALLOWED_ORIGINS.has(origin)
      ? origin
      : "https://cruisestop.eu";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "private, no-store, max-age=0",
    "Vary": "Origin"
  };
}

const ROUTE_DATA = {
  relax: {
    en: [{"name":"Mercado dos Lavradores","title":"Where Funchal Comes Alive","summary":"Colour, aromas, flavours and local life.","description":"Enter through the south entrance and discover a market full of colour, aromas and flavours. Take your time, browse the stalls and sample a few products. There is no need to buy — the experience is about discovering the atmosphere and flavours of Madeira.","whyText":"Funchal at its most vibrant: local, colourful and full of character.","duration":"20 min","image":"images/RELAX/relax-stop1.png","mapQuery":"Mercado dos Lavradores, Funchal, Madeira","lat":32.648641,"lng":-16.904178},{"name":"Fábrica Santo António","title":"Since 1893 — Flavours With History","summary":"A historic house preserving Madeiran flavours and traditions.","description":"Since 1893, Fábrica Santo António has preserved Madeiran flavours and traditions. Step inside, discover the historic shop and sample some of the house specialities.","whyText":"A historic Funchal institution where Madeiran tradition can still be tasted.","duration":"10 min","image":"images/RELAX/SANTO_ANTONIO.jpg","mapQuery":"Fábrica Santo António, Travessa do Forno, Funchal, Madeira","lat":32.649527,"lng":-16.907397},{"name":"UAUCACAU","title":"Artisan Chocolate With Island Flavours","summary":"Artisan chocolate inspired by the flavours of Madeira.","description":"Discover artisan chocolate inspired by the flavours of Madeira, with combinations such as passion fruit, banana, sour cherry, sugarcane honey and Madeira wine. Step inside, explore the different creations and choose the flavour that sparks your curiosity.","whyText":"A sweet and original way to discover some of Madeira’s most distinctive flavours.","duration":"20 min","image":"images/RELAX/relax-stop2.png","mapQuery":"UAUCACAU Rua da Queimada de Cima Funchal Madeira","lat":32.648689,"lng":-16.908596},{"name":"Funchal Cathedral (Sé)","title":"Silence and History in the Heart of Funchal","summary":"A historic pause in the heart of the city.","description":"Step inside the Sé and let the pace of the city slow down. Admire the magnificent wooden Mudéjar ceiling. In the chancel, discover the main altarpiece with 16th-century Flemish paintings and the choir stalls, with unique regional details — including cherubs with bunches of bananas.","whyText":"One of Funchal’s great historic treasures, where European art meets details unique to Madeira.","duration":"20 min","image":"images/RELAX/relax-stop3.jpg","mapQuery":"Sé Catedral, Funchal, Madeira","lat":32.648027,"lng":-16.908638},{"name":"Golden Gate Grand Café","title":"The Corner of the World","summary":"A historic café to pause, watch and feel the city.","description":"Take a seat on the terrace, order a coffee or simply whatever you feel like, and watch the city go by. It was here that writer Ferreira de Castro called the Golden Gate “A Esquina do Mundo” — “The Corner of the World” — inspired by the diversity of people and cultures that crossed paths here.","whyText":"A historic Funchal café and a perfect place to pause, watch and feel the city.","duration":"20 min","image":"images/RELAX/relax-stop4.jpg","mapQuery":"Golden Gate Funchal, Madeira","lat":32.647801,"lng":-16.909749},{"name":"Jardim Municipal","title":"A Garden in the Heart of the City","summary":"A calm garden pause in the city centre.","description":"Step into one of the most peaceful gardens in central Funchal. Sit in the shade, watch the city go by and enjoy a few unhurried minutes. No plans. Just this moment.","whyText":"A small green refuge in the city centre — perfect for pausing and breathing.","duration":"20 min","image":"images/RELAX/relax-stop5.png","mapQuery":"Jardim Municipal, Funchal, Madeira","lat":32.648088,"lng":-16.911607},{"name":"Parque de Santa Catarina","title":"One of the Best Views Over Funchal Bay","summary":"A final pause with one of the best views over Funchal Bay.","description":"End your walk with one of the best views over Funchal Bay. Stroll through the garden, find a bench and spend a few minutes simply looking out to sea.","whyText":"The bay, the port and the ocean before you — the perfect ending before returning to your ship.","duration":"20 min","image":"images/RELAX/relax-stop6.png","mapQuery":"Parque de Santa Catarina, Funchal, Madeira","lat":32.646111,"lng":-16.913412},{"name":"Funchal Port","title":"Return to Your Ship","summary":"A calm return to the ship with the timer still visible.","description":"Return calmly to Funchal Port. Keep the timer visible, follow the final walk and arrive with time to spare.","whyText":"The final point of the route, so you can return to your ship calmly and with a safe time buffer.","duration":"15 min","image":"images/funchal-hero.webp.jpg","mapQuery":"Funchal Cruise Port, Madeira","lat":32.641239,"lng":-16.916657}]
  }
};

// BEGIN RELAX LOCALIZED DATA
ROUTE_DATA.relax.de = [{"name":"Mercado dos Lavradores","title":"Wo Funchal lebendig wird","summary":"Farben, Düfte, Aromen und lokales Leben.","description":"Betritt den Markt durch den Südeingang und entdecke Farben, Düfte und Aromen. Geh langsam, schau dir die Stände an und probiere einige Produkte. Du musst nichts kaufen — hier geht es vor allem darum, die Atmosphäre und die Aromen Madeiras zu entdecken.","whyText":"Funchal von seiner lebendigsten Seite: lokal, farbenfroh und voller Charakter.","duration":"20 Min.","image":"images/RELAX/relax-stop1.png","mapQuery":"Mercado dos Lavradores, Funchal, Madeira","lat":32.648641,"lng":-16.904178},{"name":"Fábrica Santo António","title":"Seit 1893 — Geschmack mit Geschichte","summary":"Ein historisches Haus, das madeirische Aromen und Traditionen bewahrt.","description":"Seit 1893 bewahrt die Fábrica Santo António madeirische Aromen und Traditionen. Geh hinein, entdecke den historischen Laden und probiere einige Spezialitäten des Hauses.","whyText":"Ein historisches Haus in Funchal, in dem madeirische Tradition noch heute zu schmecken ist.","duration":"10 Min.","image":"images/RELAX/SANTO_ANTONIO.jpg","mapQuery":"Fábrica Santo António, Travessa do Forno, Funchal, Madeira","lat":32.649527,"lng":-16.907397},{"name":"UAUCACAU","title":"Handwerkliche Schokolade mit Inselaromen","summary":"Handwerkliche Schokolade, inspiriert von den Aromen Madeiras.","description":"Entdecke handwerklich hergestellte Schokolade, inspiriert von den Aromen Madeiras — mit Kombinationen wie Passionsfrucht, Banane, Sauerkirsche, Zuckerrohrhonig und Madeirawein. Geh hinein, entdecke die verschiedenen Kreationen und wähle den Geschmack, der dich am meisten neugierig macht.","whyText":"Eine süße und originelle Art, einige der charakteristischsten Aromen Madeiras zu entdecken.","duration":"20 Min.","image":"images/RELAX/relax-stop2.png","mapQuery":"UAUCACAU Rua da Queimada de Cima Funchal Madeira","lat":32.648689,"lng":-16.908596},{"name":"Kathedrale von Funchal (Sé)","title":"Stille und Geschichte im Herzen Funchals","summary":"Eine historische Pause im Herzen der Stadt.","description":"Betritt die Sé und spüre, wie das Tempo der Stadt langsamer wird. Bewundere die prachtvolle hölzerne Decke im Mudéjar-Stil. Im Chorraum entdeckst du den Hauptaltar mit flämischen Gemälden aus dem 16. Jahrhundert und das Chorgestühl mit einzigartigen regionalen Details — darunter Putten mit Bananenbüscheln.","whyText":"Einer der großen historischen Schätze Funchals, wo europäische Kunst auf einzigartige Details Madeiras trifft.","duration":"20 Min.","image":"images/RELAX/relax-stop3.jpg","mapQuery":"Sé Catedral, Funchal, Madeira","lat":32.648027,"lng":-16.908638},{"name":"Golden Gate Grand Café","title":"Die Ecke der Welt","summary":"Ein historisches Café zum Anhalten, Beobachten und Erleben der Stadt.","description":"Setz dich auf die Terrasse, bestell einen Kaffee oder einfach das, worauf du Lust hast, und beobachte das Treiben der Stadt. Hier nannte der Schriftsteller Ferreira de Castro das Golden Gate „A Esquina do Mundo“ — „Die Ecke der Welt“ — inspiriert von der Vielfalt der Menschen und Kulturen, die sich hier begegneten.","whyText":"Ein historisches Café in Funchal und ein perfekter Ort, um anzuhalten, zu beobachten und die Stadt zu spüren.","duration":"20 Min.","image":"images/RELAX/relax-stop4.jpg","mapQuery":"Golden Gate Funchal, Madeira","lat":32.647801,"lng":-16.909749},{"name":"Jardim Municipal","title":"Ein Garten im Herzen der Stadt","summary":"Eine ruhige Gartenpause im Stadtzentrum.","description":"Betritt einen der ruhigsten Gärten im Zentrum von Funchal. Setz dich in den Schatten, beobachte die Stadt und genieße ein paar Minuten ohne Eile. Keine Pläne. Nur dieser Moment.","whyText":"Ein kleiner grüner Rückzugsort im Stadtzentrum — perfekt zum Anhalten und Durchatmen.","duration":"20 Min.","image":"images/RELAX/relax-stop5.png","mapQuery":"Jardim Municipal, Funchal, Madeira","lat":32.648088,"lng":-16.911607},{"name":"Parque de Santa Catarina","title":"Einer der besten Blicke über die Bucht von Funchal","summary":"Eine letzte Pause mit einem der besten Blicke über die Bucht von Funchal.","description":"Beende deinen Spaziergang mit einem der schönsten Blicke über die Bucht von Funchal. Schlendere durch den Garten, such dir eine Bank und schau einfach ein paar Minuten aufs Meer.","whyText":"Die Bucht, der Hafen und der Ozean vor dir — der perfekte Abschluss vor der Rückkehr zum Schiff.","duration":"20 Min.","image":"images/RELAX/relax-stop6.png","mapQuery":"Parque de Santa Catarina, Funchal, Madeira","lat":32.646111,"lng":-16.913412},{"name":"Hafen von Funchal","title":"Zurück zu deinem Schiff","summary":"Ruhige Rückkehr zum Schiff mit sichtbarem Timer.","description":"Geh in Ruhe zum Hafen von Funchal zurück. Behalte den Timer im Blick, folge dem letzten Wegstück und komm mit genügend Zeitreserve an.","whyText":"Der Endpunkt der Route, damit du ruhig und mit sicherer Zeitreserve zum Schiff zurückkehrst.","duration":"15 Min.","image":"images/funchal-hero.webp.jpg","mapQuery":"Funchal Cruise Port, Madeira","lat":32.641239,"lng":-16.916657}];
ROUTE_DATA.relax.fr = [{"name":"Mercado dos Lavradores","title":"Là où Funchal prend vie","summary":"Couleurs, parfums, saveurs et vie locale.","description":"Entrez par la porte sud et découvrez un marché plein de couleurs, de parfums et de saveurs. Prenez votre temps, observez les étals et profitez-en pour goûter quelques produits. Pas besoin d’acheter — l’essentiel ici est de découvrir l’ambiance et les saveurs de Madère.","whyText":"Funchal dans sa version la plus vivante : locale, colorée et pleine de caractère.","duration":"20 min","image":"images/RELAX/relax-stop1.png","mapQuery":"Mercado dos Lavradores, Funchal, Madeira","lat":32.648641,"lng":-16.904178},{"name":"Fábrica Santo António","title":"Depuis 1893 — des saveurs chargées d’histoire","summary":"Une maison historique qui préserve les saveurs et traditions madériennes.","description":"Depuis 1893, la Fábrica Santo António préserve les saveurs et les traditions madériennes. Entrez, découvrez ce lieu historique et goûtez quelques spécialités de la maison.","whyText":"Une maison historique de Funchal où la tradition madérienne se savoure encore aujourd’hui.","duration":"10 min","image":"images/RELAX/SANTO_ANTONIO.jpg","mapQuery":"Fábrica Santo António, Travessa do Forno, Funchal, Madeira","lat":32.649527,"lng":-16.907397},{"name":"UAUCACAU","title":"Chocolat artisanal aux saveurs de l’île","summary":"Un chocolat artisanal inspiré des saveurs de Madère.","description":"Découvrez un chocolat artisanal inspiré des saveurs de Madère, avec des associations comme le fruit de la passion, la banane, la griotte, le miel de canne et le vin de Madère. Entrez, découvrez les différentes créations et choisissez la saveur qui éveille le plus votre curiosité.","whyText":"Une façon douce et originale de découvrir quelques-unes des saveurs les plus caractéristiques de Madère.","duration":"20 min","image":"images/RELAX/relax-stop2.png","mapQuery":"UAUCACAU Rua da Queimada de Cima Funchal Madeira","lat":32.648689,"lng":-16.908596},{"name":"Cathédrale de Funchal (Sé)","title":"Silence et histoire au cœur de Funchal","summary":"Une pause historique au cœur de la ville.","description":"Entrez dans la Sé et laissez le rythme de la ville ralentir. Admirez le magnifique plafond en bois de style mudéjar. Dans le chœur, découvrez le retable principal avec des peintures flamandes du XVIe siècle et les stalles, ornées de détails régionaux uniques — notamment des angelots avec des régimes de bananes.","whyText":"L’un des grands trésors historiques de Funchal, où l’art européen rencontre des détails uniques de Madère.","duration":"20 min","image":"images/RELAX/relax-stop3.jpg","mapQuery":"Sé Catedral, Funchal, Madeira","lat":32.648027,"lng":-16.908638},{"name":"Golden Gate Grand Café","title":"Le Coin du Monde","summary":"Un café historique pour s’arrêter, observer et ressentir la ville.","description":"Installez-vous en terrasse, commandez un café ou simplement ce qui vous fait envie, et observez le mouvement de la ville. C’est ici que l’écrivain Ferreira de Castro a surnommé le Golden Gate « A Esquina do Mundo » — « Le Coin du Monde » — inspiré par la diversité des personnes et des cultures qui s’y croisaient.","whyText":"Un café historique de Funchal et un lieu parfait pour s’arrêter, observer et ressentir la ville.","duration":"20 min","image":"images/RELAX/relax-stop4.jpg","mapQuery":"Golden Gate Funchal, Madeira","lat":32.647801,"lng":-16.909749},{"name":"Jardim Municipal","title":"Un jardin au cœur de la ville","summary":"Une pause tranquille dans un jardin du centre-ville.","description":"Entrez dans l’un des jardins les plus tranquilles du centre de Funchal. Asseyez-vous à l’ombre, regardez la ville passer et profitez de quelques minutes sans vous presser. Aucun programme. Juste ce moment.","whyText":"Un petit refuge vert au centre de la ville — parfait pour faire une pause et respirer.","duration":"20 min","image":"images/RELAX/relax-stop5.png","mapQuery":"Jardim Municipal, Funchal, Madeira","lat":32.648088,"lng":-16.911607},{"name":"Parque de Santa Catarina","title":"L’une des plus belles vues sur la baie de Funchal","summary":"Une dernière pause avec l’une des plus belles vues sur la baie de Funchal.","description":"Terminez votre promenade avec l’une des plus belles vues sur la baie de Funchal. Promenez-vous dans le jardin, trouvez un banc et passez quelques minutes simplement à regarder la mer.","whyText":"La baie, le port et l’océan devant vous — la fin parfaite avant de retourner au navire.","duration":"20 min","image":"images/RELAX/relax-stop6.png","mapQuery":"Parque de Santa Catarina, Funchal, Madeira","lat":32.646111,"lng":-16.913412},{"name":"Port de Funchal","title":"Retour à votre navire","summary":"Un retour tranquille au navire avec le minuteur toujours visible.","description":"Revenez tranquillement au port de Funchal. Gardez le minuteur visible, suivez la dernière partie du trajet et arrivez avec une bonne marge de temps.","whyText":"Le point final de la route, pour revenir au navire tranquillement et avec une marge de sécurité.","duration":"15 min","image":"images/funchal-hero.webp.jpg","mapQuery":"Funchal Cruise Port, Madeira","lat":32.641239,"lng":-16.916657}];
ROUTE_DATA.relax.pt = [{"name":"Mercado dos Lavradores","title":"Onde o Funchal ganha vida","summary":"Cor, aromas, sabores e vida local.","description":"Entre pela porta sul e descubra um mercado cheio de cor, aromas e sabores. Caminhe devagar, observe as bancas e aproveite para provar alguns produtos. Não precisa de comprar — aqui, a experiência está sobretudo em descobrir o ambiente e os sabores da Madeira.","whyText":"O Funchal na sua versão mais viva: local, colorido e cheio de personalidade.","duration":"20 min","image":"images/RELAX/relax-stop1.png","mapQuery":"Mercado dos Lavradores, Funchal, Madeira","lat":32.648641,"lng":-16.904178},{"name":"Fábrica Santo António","title":"Desde 1893 — sabores com história","summary":"Uma casa histórica ligada aos sabores e tradições madeirenses.","description":"Desde 1893, a Fábrica Santo António preserva sabores e tradições madeirenses. Entre, descubra o espaço histórico e prove algumas das especialidades da casa.","whyText":"Uma casa histórica do Funchal onde ainda se saboreia a tradição madeirense.","duration":"10 min","image":"images/RELAX/SANTO_ANTONIO.jpg","mapQuery":"Fábrica Santo António, Travessa do Forno, Funchal, Madeira","lat":32.649527,"lng":-16.907397},{"name":"UAUCACAU","title":"Chocolate artesanal com sabores da ilha","summary":"Chocolate artesanal inspirado nos sabores da Madeira.","description":"Descubra chocolate artesanal inspirado nos sabores da Madeira, com combinações como maracujá, banana, ginja, mel de cana e Vinho Madeira. Entre, conheça as diferentes criações e escolha o sabor que mais lhe desperta a curiosidade.","whyText":"Uma forma doce e original de descobrir alguns dos sabores mais característicos da Madeira.","duration":"20 min","image":"images/RELAX/relax-stop2.png","mapQuery":"UAUCACAU Rua da Queimada de Cima Funchal Madeira","lat":32.648689,"lng":-16.908596},{"name":"Sé do Funchal","title":"Silêncio e história no coração do Funchal","summary":"Uma pausa histórica no coração da cidade.","description":"Entre na Sé e deixe o ritmo da cidade abrandar. Admire o magnífico teto de madeira em estilo mudéjar. Na capela-mor, descubra o retábulo-mor com pinturas flamengas do século XVI e o cadeiral com detalhes regionais únicos — incluindo querubins com cachos de bananas.","whyText":"Um dos grandes tesouros históricos do Funchal, onde a arte europeia se cruza com detalhes únicos da Madeira.","duration":"20 min","image":"images/RELAX/relax-stop3.jpg","mapQuery":"Sé Catedral, Funchal, Madeira","lat":32.648027,"lng":-16.908638},{"name":"Golden Gate Grand Café","title":"A Esquina do Mundo","summary":"Um café histórico para parar, observar e sentir a cidade.","description":"Sente-se na esplanada, peça um café ou simplesmente aquilo que lhe apetecer e observe o movimento da cidade. Foi aqui que o escritor Ferreira de Castro chamou ao Golden Gate “A Esquina do Mundo”, pela diversidade de pessoas e culturas que por ali se cruzavam.","whyText":"Um café histórico do Funchal e um lugar perfeito para parar, observar e sentir a cidade.","duration":"20 min","image":"images/RELAX/relax-stop4.jpg","mapQuery":"Golden Gate Funchal, Madeira","lat":32.647801,"lng":-16.909749},{"name":"Jardim Municipal","title":"Um jardim no coração da cidade","summary":"Uma pausa calma num jardim no centro da cidade.","description":"Entre num dos jardins mais tranquilos do centro do Funchal. Sente-se à sombra, veja a cidade passar e aproveite alguns minutos sem pressa. Sem planos. Só este momento.","whyText":"Um pequeno refúgio verde no centro da cidade — perfeito para parar e respirar.","duration":"20 min","image":"images/RELAX/relax-stop5.png","mapQuery":"Jardim Municipal, Funchal, Madeira","lat":32.648088,"lng":-16.911607},{"name":"Parque de Santa Catarina","title":"A melhor vista sobre a baía do Funchal","summary":"Uma pausa final com uma das melhores vistas sobre a baía do Funchal.","description":"Termine a caminhada com uma das melhores vistas sobre a baía do Funchal. Passeie pelo jardim, procure um banco e fique alguns minutos simplesmente a olhar para o mar.","whyText":"A baía, o porto e o oceano diante de si — o final perfeito antes de regressar ao navio.","duration":"20 min","image":"images/RELAX/relax-stop6.png","mapQuery":"Parque de Santa Catarina, Funchal, Madeira","lat":32.646111,"lng":-16.913412},{"name":"Porto do Funchal","title":"Regresso ao navio","summary":"Regresso tranquilo ao navio com o temporizador sempre visível.","description":"Regresse tranquilamente ao Porto do Funchal. Mantenha o temporizador visível, siga a caminhada final e chegue com tempo de sobra.","whyText":"O ponto final da rota, para regressar ao navio com calma e margem de segurança.","duration":"15 min","image":"images/funchal-hero.webp.jpg","mapQuery":"Funchal Cruise Port, Madeira","lat":32.641239,"lng":-16.916657}];
// END RELAX LOCALIZED DATA

export async function onRequestPost({ request, env }) {
  const headers = corsHeaders(request, "POST, OPTIONS");

  if (!env.ACCESS_DB) {
    return Response.json(
      { error: "Access database is not configured" },
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();

    const route = String(body.route || "").trim().toLowerCase();
    const language = String(body.language || "en").trim().toLowerCase();
    const accessToken = String(body.accessToken || "").trim();
    const deviceToken = String(body.deviceToken || "").trim();

    if (!ROUTE_DATA[route] || !ROUTE_DATA[route][language]) {
      return Response.json(
        { error: "Route not available" },
        { status: 404, headers }
      );
    }

    if (!/^[a-f0-9]{32}$/i.test(accessToken)) {
      return Response.json(
        { error: "Invalid access token" },
        { status: 400, headers }
      );
    }

    if (!/^[A-Za-z0-9_-]{16,128}$/.test(deviceToken)) {
      return Response.json(
        { error: "Invalid device token" },
        { status: 400, headers }
      );
    }

    const purchase = await env.ACCESS_DB
      .prepare(`
        SELECT session_id, route, expires_at
        FROM purchases
        WHERE access_token = ?
      `)
      .bind(accessToken)
      .first();

    if (!purchase) {
      return Response.json(
        { error: "Access not found" },
        { status: 404, headers }
      );
    }

    if (String(purchase.route || "").toLowerCase() !== route) {
      return Response.json(
        { error: "Access does not match this route" },
        { status: 403, headers }
      );
    }

    const expiresAt = Number(purchase.expires_at);
    const now = Math.floor(Date.now() / 1000);

    if (!expiresAt || now >= expiresAt) {
      return Response.json(
        { error: "Access expired" },
        { status: 410, headers }
      );
    }

    const activation = await env.ACCESS_DB
      .prepare(`
        SELECT id
        FROM device_activations
        WHERE session_id = ? AND device_token = ?
      `)
      .bind(purchase.session_id, deviceToken)
      .first();

    if (!activation) {
      return Response.json(
        { error: "Device not activated for this purchase" },
        { status: 403, headers }
      );
    }

    await env.ACCESS_DB
      .prepare(`
        UPDATE device_activations
        SET last_seen_at = unixepoch()
        WHERE session_id = ? AND device_token = ?
      `)
      .bind(purchase.session_id, deviceToken)
      .run();

    return Response.json({
      ok: true,
      route,
      language,
      accessExpiresAt: expiresAt * 1000,
      stops: ROUTE_DATA[route][language]
    }, { headers });

  } catch (err) {
    console.error("Route data error:", err);

    return Response.json(
      { error: "Could not load route" },
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions({ request }) {
  return new Response(null, {
    headers: corsHeaders(request, "POST, OPTIONS")
  });
}