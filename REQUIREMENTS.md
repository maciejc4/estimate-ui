# Wymagania systemu „estimate"

## 1. Opis aplikacji

- Aplikacja webowa (w kolejnych etapach również mobile) dla małych firm budowlanych.
- Cel: szybkie generowanie kosztorysów dla klientów.

## 2. Scenariusze i interakcje użytkownika

### 2.1. Zarządzanie kontem

- Użytkownik tworzy konto lub uruchamia demo (bez rejestracji, jeśli przewidziane).
- Użytkownik loguje się na konto.
- Użytkownik może usunąć swoje konto.
- Użytkownik może zmienić hasło.

### 2.2. Prace (czynności budowlane)

- Użytkownik tworzy nowe prace (np. malowanie, gruntowanie, przyklejanie listew przypodłogowych).
- Dla każdej pracy definiowana jest jednostka (np. m² dla malowania/gruntowania, mb dla listew).
- Do każdej pracy można dodać potrzebne materiały.
- Każdy materiał ma swoją jednostkę ilości (l, m, kg itd.).
- Definiowane jest zużycie materiału na jednostkę pracy.
- Użytkownik zapisuje pracę.
- Użytkownik może przeglądać swoje prace, edytować je, dodawać nowe oraz usuwać.

### 2.3. Szablony remontowe

- Użytkownik definiuje szablony remontowe (np. „Remont łazienki") złożone z wcześniej zdefiniowanych prac (malowanie, skuwanie płytek, montaż brodzika itd.).
- Jeżeli jakaś praca nie została wcześniej zdefiniowana, użytkownik może ją dodać bezpośrednio z okna tworzenia szablonu remontowego.
- Szablon może zawierać również czynności niepowiązane z szablonem (pojedyncze prace).
- Użytkownik może przeglądać swoje szablony, edytować je, dodawać nowe oraz usuwać.

### 2.4. Kosztorysy

- Po zdefiniowaniu prac i szablonów użytkownik może przygotować wycenę dla klienta (kosztorys).
- Kosztorys budowany jest z użyciem szablonów remontowych; jeden kosztorys może być utworzony na podstawie wielu szablonów.
- W trakcie tworzenia kosztorysu użytkownik może zdefiniować nową pracę bezpośrednio z trybu tworzenia kosztorysu, jeśli czegoś brakuje.
- Kosztorys zawiera:
  - dane inwestora,
  - adres (ulicę) inwestycji,
  - cenę materiału,
  - cenę robocizny,
  - cenę ostateczną.
- Kosztorys może zawierać:
  - uwagi,
  - datę ważności,
  - datę rozpoczęcia prac.
- Dla każdego kosztorysu użytkownik może przyznać rabat:
  - osobno na materiały,
  - osobno na robociznę.
- Użytkownik może przeglądać swoje kosztorysy, edytować je, dodawać nowe oraz usuwać.

### 2.5. Generowanie dokumentów

- Po utworzeniu kosztorysu użytkownik może wygenerować na jego podstawie plik PDF.
- Przed wygenerowaniem PDF użytkownik konfiguruje, jakie informacje mają się znaleźć w dokumencie:
  - wszystkie pozycje,
  - tylko podstawowe informacje.
- Jeżeli przyznano rabat, informacja o tym jest wyeksponowana w wygenerowanym dokumencie PDF.
- Wygenerowany PDF zawiera (jeżeli dane zostały wprowadzone):
  - datę rozpoczęcia prac,
  - datę ważności,
  - notatki (uwagi).

### 2.6. Dane firmy i kontakt

- W ustawieniach aplikacji użytkownik może zdefiniować:
  - nazwę firmy,
  - adres e-mail,
  - numer telefonu.
- W ustawieniach dostępny jest opis, do czego te dane są wykorzystywane.
- Podczas generowania PDF, jeżeli użytkownik podał dane kontaktowe, w widocznym miejscu na kosztorysie znajdują się:
  - numer telefonu wykonawcy,
  - adres e-mail wykonawcy.

### 2.7. Rola administratora

- Specjalny użytkownik — administrator:
  - może przeglądać kosztorysy, prace oraz szablony utworzone przez innych użytkowników,
  - może przeglądać zarejestrowanych użytkowników,
  - może dodawać nowych użytkowników,
  - może usuwać istniejących użytkowników.

## 3. Struktura projektu i proces developmentu

### 3.1. Struktura projektów

- Dwa projekty:
  - `estimate-ui`,
  - `estimate-backend`.
- Dwa oddzielne repozytoria (jeżeli to możliwe, połączone jednym projektem / nadrzędną strukturą).
- Każde repozytorium zawiera informację:
  - jak zbudować projekt,
  - jak uruchomić projekt lokalnie (development),
  - jak wykonać deployment do GCP.

### 3.2. Proces wytwarzania oprogramowania

- Trunk-based development.
- Każda zmiana w niewielkim commicie.
- Maksymalna długość opisu commita: 255 znaków.
- Dla każdej zmiany w kodzie tworzony jest nowy issue w GitHub.

## 4. Wymagania jakościowe dotyczące kodu

- Kod musi przestrzegać zasad Clean Code (nazewnictwo, długość klas, metod itd.).
- Kod musi wspierać i stosować zasady SOLID.
- Kod pokryty testami:
  - jednostkowymi,
  - komponentowymi,
  - integracyjnymi.
- Nazewnictwo (pakiety, klasy, komentarze itd.) w języku angielskim.

## 5. Infrastruktura i DevOps

- Docelowo aplikacje hostowane na GCP Cloud Run — projekty powinny być na to przygotowane.
- Na obecnym etapie aplikacje nie są jeszcze wypychane na GCP.
- Każda aplikacja skonteneryzowana (Docker / kontenery).
- CI/CD dla każdego repozytorium w GitHub (GitHub Actions).
- Wykorzystanie skanera bezpieczeństwa / Sonar (lub rozwiązania oferowanego przez GitHub, jeśli dostępne).

## 6. Stos technologiczny — backend

- Język: Java (preferowana wersja nowsza niż 21; w przypadku braku kompatybilności dopuszczalna Java 21).
- Framework: Spring Boot z obsługą Fiber Threads (jeżeli wspiera).
- Biblioteki / narzędzia:
  - Lombok,
  - Maven,
  - Testcontainers,
  - Spock,
  - WireMock.
- Baza danych: MongoDB (na razie w trybie in-memory).

## 7. Stos technologiczny — frontend

- Język: TypeScript.
- Stylowanie: Tailwind CSS.
- Architektura: nowoczesny design i architektura frontendu.
- Używany jest najnowszy stabilny framework (np. React/Vue/Svelte – zależnie od wyboru).
- Preferowane renderowanie po stronie serwera (Server-Side Rendering).
- Logika po stronie frontendu możliwie prosta; złożone operacje przeniesione na backend.
- Frontend powinien przejść testy obciążeniowe (loading tests).
- Wsparcie dla internacjonalizacji (i18n).
- Wsparcie dla robotów indeksujących (SEO-friendly).

## 8. Wymagania dotyczące designu i UX

- Design responsywny (RWD).
- Styl: Neumorphism i Soft UI.
- Generowany PDF powinien nawiązywać wyglądem do strony WWW (spójny look & feel).
- Obsługa polskich znaków zarówno w interfejsie webowym, jak i w PDF.
- UX:
  - łatwość użycia,
  - przejrzysta nawigacja.
- Wsparcie dla dostępności:
  - zgodność z WCAG 2.1 AA.

## 9. Bezpieczeństwo

- Hasła przechowywane w bezpieczny sposób (np. bcrypt, scrypt, Argon2).
- Ochrona przed atakami:
  - XSS,
  - CSRF.
- Ograniczenie liczby prób logowania (rate limiting / lockout).
- Regularne audyty bezpieczeństwa kodu.
- Szyfrowanie danych wrażliwych.
