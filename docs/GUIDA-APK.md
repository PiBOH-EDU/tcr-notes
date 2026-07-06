# Guida: Build APK Android per tcr-notes

> **Versione app:** 0.10.0  
> **Destinatario:** amministratore / maintainer del progetto  
> **Ultimo aggiornamento:** 2026-07-05

---

## Cos'è questa guida

Questa guida spiega come generare un file **APK** (app Android) per tcr-notes, in modo che gli studenti possano installarla sul telefono senza aprire il browser ogni volta.

L'APK generato dal workflow è un'**app nativa Android** che carica il sito web `https://tcr-notes.vercel.app` in una vista a schermo intero (WebView), simile a un browser con una sola scheda.

---

## Requisiti tecnici

- Android **6.0+** (API 23+) — compatibilità garantita
- Spazio libero: circa 10 MB per l'APK installato
- Connessione Internet per caricare l'app (il contenuto è online)

---

## Metodo 1: Build automatica via GitHub Actions (consigliato)

Il repository contiene un workflow `.github/workflows/build-apk.yml` che compila automaticamente l'APK ad ogni push su `main`.

### Passo 1: Avvia il workflow manualmente

1. Vai su GitHub → repository `PiBOH-EDU/tcr-notes` → tab **Actions**
2. Clicca su **"Build APK Android"** nel menu a sinistra
3. Clicca il pulsante **"Run workflow"** → seleziona il branch `main` → **"Run workflow"**

### Passo 2: Scarica l'APK

1. Attendi che il workflow termini (circa 5-10 minuti)
2. Clicca sul run completato
3. Scorri in basso alla sezione **Artifacts**
4. Scarica `tcr-notes-apk-unsigned`

### Passo 3: Build debug o release

#### Se NON hai un keystore (build debug)

Se non hai configurato un keystore per firmare l'APK, devi usare il target **debug** invece di release:

```bash
cd android
./gradlew assembleDebug
```

L'APK si troverà in:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

> ⚠️ L'APK debug può mostrare un avviso di sicurezza all'installazione. È normale e si può ignorare.

#### Se HAI un keystore (build release firmata)

L'APK generato da `assembleRelease` è **non firmato** (unsigned). Per installarlo senza warning di sicurezza, firmalo con un keystore.

##### Creare un keystore (una sola volta)

```bash
keytool -genkey -v -keystore tcrnotes.keystore -alias tcrnotes \
  -keyalg RSA -keysize 2048 -validity 10000
```

Salva il file `tcrnotes.keystore` e la password in un luogo sicuro.

##### Firmare l'APK

```bash
# Allinea l'APK (richiesto per Android 11+)
zipalign -v 4 app-release-unsigned.apk app-release-aligned.apk

# Firma con il keystore
apksigner sign --ks tcrnotes.keystore \
  --out tcr-notes-signed.apk app-release-aligned.apk
```

Ora puoi distribuire `tcr-notes-signed.apk` agli studenti.

---

## Metodo 2: Build in locale

Se preferisci compilare l'APK sul tuo computer:

### Prerequisiti

- Node.js 20+
- Java JDK 17
- Android Studio (per l'Android SDK)

### Passaggi (Windows CMD)

> ⚠️ **Importante:** dopo ogni modifica a `capacitor.config.json`, `logo.png` o qualsiasi file di configurazione Capacitor, devi sempre eseguire **`npx cap sync`** prima di buildare. Altrimenti le modifiche non vengono copiate nel progetto Android.

Apri **CMD** o **PowerShell** nella cartella del progetto:

```cmd
:: 1. Clona il repository
git clone https://github.com/PiBOH-EDU/tcr-notes.git
cd tcr-notes

:: 2. Installa dipendenze
npm install

:: 3. Build dell'app web
npm run build

:: 4. Installa Capacitor e plugin
npm install @capacitor/core @capacitor/android @capacitor/cli @capacitor/browser @capacitor/app

:: 5. Aggiungi la piattaforma Android
npx cap add android

:: 6. Sincronizza (OBBLIGATORIO dopo ogni modifica al config)
npx cap sync

:: 7. Apri in Android Studio (opzionale, per debug)
npx cap open android

:: 8. Build da riga di comando
cd android

:: Se non hai un keystore, usa debug (consigliato):
gradlew assembleDebug

:: Se hai un keystore e vuoi firmare l'APK:
:: gradlew assembleRelease
```

> Nota: il file `capacitor.config.json` è già presente nel repository con la configurazione predefinita. Le icone dell'app (`android-assets/`) sono anch'esse pre-generate dal `logo.png`. Non è necessario eseguire `npx cap init` né generare le icone manualmente.

L'APK si troverà in:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

> 💡 **Perché l'app carica sempre l'ultima versione:** il plugin `@capacitor/app` è configurato per ricaricare automaticamente la pagina quando l'app torna in primo piano (foreground). Inoltre, il `capacitor.config.json` punta direttamente al sito live `https://tcr-notes.vercel.app`.

L'APK si troverà in:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## Metodo 3: TWA con Bubblewrap (APK più leggero)

Se vuoi un APK **ancora più leggero** (circa 150 KB invece di 3-5 MB), puoi usare **Bubblewrap** che genera un **Trusted Web Activity** (TWA). Un TWA è essenzialmente un collegamento nativo al sito web, senza WebView integrata.

### Setup Bubblewrap

```bash
# Installa Bubblewrap
npm install -g @bubblewrap/cli

# Crea il progetto TWA (interattivo)
bubblewrap init --manifest https://tcr-notes.vercel.app/manifest.json

# Build dell'APK
bubblewrap build
```

Durante `init`, Bubblewrap ti chiederà:
- **Package ID**: `com.tcrnotes.app`
- **Keystore**: puoi crearne uno nuovo o usarne uno esistente
- **Icona**: verrà scaricata automaticamente dal manifest

L'APK firmato si troverà nella cartella del progetto TWA.

> ⚠️ **Nota:** il workflow GitHub Actions attuale usa Capacitor, non Bubblewrap. Se vuoi automatizzare anche Bubblewrap in CI, contatta il maintainer.

---

## Installazione su Android

1. Trasferisci il file APK sul telefono (email, WhatsApp, Google Drive, cavo USB)
2. Sul telefono, apri il file APK
3. Se appare "Installazione da fonti sconosciute", consentila per l'app che hai usato per trasferire l'APK
4. Completa l'installazione
5. Troverai l'icona 📚 **tcr-notes** nella schermata home

---

## Aggiornamento dell'app

Poiché l'APK wrappa il sito web, **il contenuto si aggiorna automaticamente** ogni volta che apri l'app (carica il sito da Vercel).

Per aggiornare l'app stessa (es. nuova icona, nuove funzionalità native):
1. Ricompila l'APK con il workflow
2. Distribuisci il nuovo APK agli studenti
3. Gli studenti devono reinstallare l'app

---

## Pulizia cache npm e Gradle

Se il build fallisce con errori strani, file mancanti o comportamenti anomali, la causa più comune è la **cache corrotta** di npm o Gradle. Ecco come pulirla.

### Pulizia cache npm (Windows)

```cmd
:: Pulisci la cache di npm
npm cache clean --force

:: Rimuovi node_modules e reinstalla tutto
cd C:\percorso\del\progetto
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Pulizia build Gradle (Windows)

```cmd
:: Entra nella cartella Android
cd android

:: Pulisci i file di build generati
gradlew clean

:: (Opzionale) Rimuovi completamente la cartella build
rmdir /s /q app\build
```

### Reset completo piattaforma Android (Windows)

Se i comandi sopra non bastano, puoi **rimuovere e ricreare** la piattaforma Android:

```cmd
:: Dalla root del progetto
npx cap rm android
npx cap add android
npx cap sync
```

> ⚠️ Attenzione: questo elimina eventuali modifiche manuali fatte nella cartella `android\` (es. configurazioni custom nel `AndroidManifest.xml`). Usalo solo se strettamente necessario.

### Comando "nucleare" (tutto in uno, Windows)

Se vuoi essere sicuro al 100% di partire da zero:

```cmd
cd C:\percorso\del\progetto

:: 1. Pulizia npm
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install

:: 2. Build web
npm run build

:: 3. Pulizia Android
npx cap rm android
npx cap add android
npx cap sync

:: 4. Build APK
cd android
gradlew assembleDebug
```

---

## Troubleshooting

### "App non installata"
- L'APK unsigned potrebbe essere rifiutato da alcuni telefoni. Firma l'APK con un keystore.
- Controlla che la versione Android del telefono sia 6.0+.

### "Schermata bianca all'apertura"
- Verifica che il telefono abbia connessione Internet.
- Controlla che il sito `https://tcr-notes.vercel.app` sia online.

### Build fallisce nel workflow
- Vai su GitHub → Actions → seleziona il run fallito
- Scarica l'artifact `build-logs` per vedere l'errore
- Verifica che `npm run build` passi in locale prima di pushare

---

**Fine della guida.** Per dubbi o problemi, apri una issue su GitHub.
