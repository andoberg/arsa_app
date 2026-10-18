# ARSA: vedlikehold og publisering

Oppdatert 2026-10-18. Eier har godkjent offentlig publisering.
Modellutviklingen forblir frosset etter beslutning 0065.

## Prosjekter og adresser

- Dette repositoryet: https://github.com/andoberg/arsa_app — `origin`, gren `main`.
- Nettside: https://arsa-app.andoberg.workers.dev/
- Cloudflare Worker: `arsa-app`, under Workers & Pages i eierens Cloudflare-konto.
- Separat lokalt kildeprosjekt: `ARSA_PREDICTOR_CHATGTP`. Dette forskningsprosjektet
  er ikke inkludert i publiseringsrepositoryet. Be eieren om stien hvis den er ukjent.
- Ferdig lokal app i kildeprosjektet: `ARSA_GENOTYPEOPPSLAG.html`.
- Redigerbar mal: `src/arsa_predictor/templates/arsa_genotype_lookup.template.html`.
- Publiserte filer: `public/`. Kontrollsummer: `release-manifest.json`.

Denne utgaven av rutinen er portabel; personlige lokale stier og kontodetaljer
står bare i den lokale prosjektutgaven. Les også [AGENTS.md](../AGENTS.md).

## Hva er automatisk?

En push til `main` utløser et produksjonsbygg i Cloudflare:

- Rotmappe: `/`.
- Bygg: `npm ci && npm test`.
- Publisering: `npm run deploy` (Cloudflare CLI `cf`).
- Preview-bygg: deaktivert.
- GitHub Actions kjører separat `npm test` og `npx cf deploy --dry-run`.

Cloudflare venter ikke på GitHub Actions, men kjører sine egne kontroller før
publisering. Det finnes ingen automatisk synkronisering fra kildeprosjektet.
Lokale endringer og lokale commits endrer ikke nettsiden før de er pushet.

## Rutine ved endringer

1. Les prosjektinstruksjonene og sjekk `git status` i begge prosjektene. Bevar
   andre brukerendringer. Bekreft at `origin` peker til ARSA, ikke palliasjonsappen.
2. Endre kildemal eller data i kildeprosjektet, ikke bare genererte nett-filer.
   Bygg den lokale appen med eksisterende byggesteg; for dagens mal brukes
   `.venv/bin/python -m arsa_predictor.literature_additions` fra kildeprosjektet.
   Kjør relevante tester, inkludert
   `node scripts/test_lookup_dom.cjs ARSA_GENOTYPEOPPSLAG.html`.
3. Lag en ny midlertidig pakke fra kildeprosjektet med
   `node scripts/prepare_web_release.cjs <ny-ikke-eksisterende-mappe>`.
   Skriptet er i kildeprosjektet, ikke dette repositoryet. Det nekter å overskrive
   en eksisterende mappe. Bruk en ny undermappe i en midlertidig katalog.
   Pakkingen deler data i mindre filer uten å endre data eller appkode.
4. Kontroller forskjellene. Oppdater bare genererte filer i `public/` og
   `release-manifest.json`. Identifiser utgåtte chunk-filer fra forrige manifest
   og fjern bare disse. Bevar `.git`, konfigurasjon, tester, dokumentasjon og
   andre endringer. Ikke bruk bred sletting eller ukontrollert speiling.
5. Kjør fra dette repositoryet:

   ```sh
   npm ci
   npm test
   npx cf deploy --dry-run
   ```

   Kontroller at pakken ikke inneholder hemmeligheter, råartikler eller data
   uten tillatelse til redistribusjon. `public/` er offentlig nedlastbart,
   inkludert de innebygde litteratur- og prediktordataene.
6. Når brukeren har bedt om publisering: stage kun gjennomgåtte filer, commit
   med beskrivende melding og kjør `git push origin main`. En forklaring,
   gjennomgang eller lokal utprøving er ikke i seg selv en bestilling på push.
   «Oppdater og publiser» omfatter hele rutinen.
7. Bekreft at Cloudflare-bygget for den aktuelle commiten lykkes, og sjekk
   GitHub Actions og nettsiden. Ved appendringer: test kjent og ukjent genotype
   i nettleseren, inkludert litteratur og utforskende skår. Ved bare dokumentasjon:
   bekreft at appfilene er uendret og at nettsiden fortsatt svarer.
8. Rapporter nettadresse, commit og kontrollstatus. Ved feil, oppgi hvilken
   versjon som fortsatt er live. Normal publisering skal skje via GitHub,
   ikke direkte `cf deploy` som omgår kjeden.

## Innlogging, sporbarhet og tilbakerulling

Sjekk `gh auth status` før GitHub-arbeid. Ikke start ny innlogging når den
eksisterende virker. Cloudflare MCP, CLI og nettleser har separate innlogginger;
Cloudflare Builds bruker sin konfigurerte byggtilgang. Aldri lagre tokenverdier
i dokumentasjon eller Git. Oppsettet bruker en eksisterende byggtilgang med
historisk etikett fra palliasjonsprosjektet; ARSA er et separat prosjekt.

Første verifiserte automatiske publisering var commit
`a970d097545a47b1b1deebe57eec7a40951ba48b`, 2026-10-18. Både Cloudflare og
GitHub Actions rapporterte success.

Ved tilbakerulling: finn siste verifiserte gode commit og lag normalt en ny
revert-commit som pushes gjennom samme kjede. Ikke bruk force-push eller
destruktiv reset. Dokumentasjonen gir ikke bakgrunnsovervåking eller global
hukommelse; den oppdages når prosjektets AGENTS.md blir lest.
