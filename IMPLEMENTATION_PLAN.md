# Plan implementacji systemu „estimate"

**Data utworzenia:** 2025-12-11  
**Ostatnia aktualizacja:** 2025-12-11  
**Status:** W trakcie realizacji - Backend i Frontend działają lokalnie

---

## Przegląd

System składa się z dwóch aplikacji:
- **estimate-backend** — API REST w Java/Spring Boot z MongoDB
- **estimate-ui** — Frontend w Next.js (React) z TypeScript i Tailwind CSS

---

## Fazy implementacji

### Faza 0: Przygotowanie infrastruktury
**Status:** ✅ Zrobione

| Krok | Opis | Status |
|------|------|--------|
| 0.1 | Utworzenie repozytorium `estimate-backend` na GitHub | ✅ |
| 0.2 | Utworzenie repozytorium `estimate-ui` na GitHub | ✅ |
| 0.3 | Konfiguracja GitHub Actions CI/CD dla backend | ✅ |
| 0.4 | Konfiguracja GitHub Actions CI/CD dla frontend | ✅ |
| 0.5 | Dodanie skanera bezpieczeństwa (CodeQL) | ✅ |

---

### Faza 1: Backend — Fundament
**Status:** ✅ Zrobione

| Krok | Opis | Status |
|------|------|--------|
| 1.1 | Inicjalizacja projektu Spring Boot (Java 21, Maven) | ✅ |
| 1.2 | Konfiguracja Lombok, MongoDB (embedded) | ✅ |
| 1.3 | Struktura pakietów (domain, application, infrastructure, api) | ✅ |
| 1.4 | Dockerfile dla backend | ✅ |
| 1.5 | README z instrukcją budowania i uruchamiania | ✅ |

---

### Faza 2: Backend — Autentykacja i użytkownicy
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 2.1 | Model User (id, email, passwordHash, role, companyName, phone) | ⬜ |
| 2.2 | UserRepository (MongoDB) | ⬜ |
| 2.3 | UserService (rejestracja, logowanie, zmiana hasła, usuwanie) | ⬜ |
| 2.4 | Haszowanie haseł (BCrypt/Argon2) | ⬜ |
| 2.5 | JWT Authentication (Spring Security) | ⬜ |
| 2.6 | Rate limiting dla logowania | ⬜ |
| 2.7 | Endpointy: POST /auth/register, POST /auth/login, PUT /users/password, DELETE /users | ⬜ |
| 2.8 | Testy jednostkowe i integracyjne (Spock, Testcontainers) | ⬜ |

---

### Faza 3: Backend — Prace (Works)
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 3.1 | Model Work (id, userId, name, unit, materials[]) | ⬜ |
| 3.2 | Model Material (name, unit, consumptionPerWorkUnit) | ⬜ |
| 3.3 | WorkRepository | ⬜ |
| 3.4 | WorkService (CRUD) | ⬜ |
| 3.5 | Endpointy: GET/POST/PUT/DELETE /api/works | ⬜ |
| 3.6 | Testy | ⬜ |

---

### Faza 4: Backend — Szablony remontowe (Templates)
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 4.1 | Model RenovationTemplate (id, userId, name, workIds[], additionalWorks[]) | ⬜ |
| 4.2 | RenovationTemplateRepository | ⬜ |
| 4.3 | RenovationTemplateService (CRUD) | ⬜ |
| 4.4 | Endpointy: GET/POST/PUT/DELETE /api/templates | ⬜ |
| 4.5 | Testy | ⬜ |

---

### Faza 5: Backend — Kosztorysy (Estimates)
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 5.1 | Model Estimate (id, userId, investorName, investorAddress, templateIds[], works[], materialCost, laborCost, totalCost, materialDiscount, laborDiscount, notes, validUntil, startDate) | ⬜ |
| 5.2 | EstimateRepository | ⬜ |
| 5.3 | EstimateService (CRUD, kalkulacja kosztów) | ⬜ |
| 5.4 | Endpointy: GET/POST/PUT/DELETE /api/estimates | ⬜ |
| 5.5 | Testy | ⬜ |

---

### Faza 6: Backend — Generowanie PDF
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 6.1 | Integracja biblioteki do PDF (iText/OpenPDF) | ⬜ |
| 6.2 | PdfGeneratorService | ⬜ |
| 6.3 | Konfiguracja szczegółowości PDF (pełna/podstawowa) | ⬜ |
| 6.4 | Wsparcie dla polskich znaków | ⬜ |
| 6.5 | Endpoint: GET /api/estimates/{id}/pdf | ⬜ |
| 6.6 | Testy | ⬜ |

---

### Faza 7: Backend — Panel administratora
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 7.1 | Role-based access control (ADMIN/USER) | ⬜ |
| 7.2 | AdminService (zarządzanie użytkownikami) | ⬜ |
| 7.3 | Endpointy admin: GET /admin/users, DELETE /admin/users/{id} | ⬜ |
| 7.4 | Endpointy admin: GET /admin/estimates, GET /admin/works, GET /admin/templates | ⬜ |
| 7.5 | Testy | ⬜ |

---

### Faza 8: Frontend — Fundament
**Status:** ✅ Zrobione

| Krok | Opis | Status |
|------|------|--------|
| 8.1 | Inicjalizacja Next.js 14+ z App Router | ✅ |
| 8.2 | Konfiguracja TypeScript, Tailwind CSS | ✅ |
| 8.3 | Konfiguracja i18n (next-intl) | ⬜ W trakcie |
| 8.4 | Neumorphism theme (Tailwind config) | ⬜ W trakcie |
| 8.5 | Layout główny, nawigacja | ⬜ W trakcie |
| 8.6 | Dockerfile dla frontend | ✅ |
| 8.7 | README z instrukcją | ✅ |

---

### Faza 9: Frontend — Autentykacja
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 9.1 | Strona logowania (/login) | ⬜ |
| 9.2 | Strona rejestracji (/register) | ⬜ |
| 9.3 | Przycisk "Demo" (logowanie bez rejestracji) | ⬜ |
| 9.4 | Auth context/provider (JWT storage) | ⬜ |
| 9.5 | Protected routes middleware | ⬜ |
| 9.6 | Strona ustawień konta (/settings) | ⬜ |

---

### Faza 10: Frontend — Prace
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 10.1 | Lista prac (/works) | ⬜ |
| 10.2 | Formularz tworzenia/edycji pracy | ⬜ |
| 10.3 | Dodawanie materiałów do pracy | ⬜ |
| 10.4 | Usuwanie pracy | ⬜ |

---

### Faza 11: Frontend — Szablony
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 11.1 | Lista szablonów (/templates) | ⬜ |
| 11.2 | Formularz tworzenia/edycji szablonu | ⬜ |
| 11.3 | Wybór prac do szablonu | ⬜ |
| 11.4 | Dodawanie nowej pracy z poziomu szablonu | ⬜ |

---

### Faza 12: Frontend — Kosztorysy
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 12.1 | Lista kosztorysów (/estimates) | ⬜ |
| 12.2 | Formularz tworzenia kosztorysu | ⬜ |
| 12.3 | Wybór szablonów i prac | ⬜ |
| 12.4 | Kalkulator kosztów (materiały, robocizna, rabaty) | ⬜ |
| 12.5 | Podgląd i edycja kosztorysu | ⬜ |
| 12.6 | Generowanie i pobieranie PDF | ⬜ |
| 12.7 | Konfiguracja szczegółowości PDF | ⬜ |

---

### Faza 13: Frontend — Panel admina
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 13.1 | Widok listy użytkowników (/admin/users) | ⬜ |
| 13.2 | Zarządzanie użytkownikami (dodawanie, usuwanie) | ⬜ |
| 13.3 | Przeglądanie danych innych użytkowników | ⬜ |

---

### Faza 14: Testy E2E i optymalizacja
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 14.1 | Testy E2E (Playwright/Cypress) | ⬜ |
| 14.2 | Testy wydajnościowe (Lighthouse) | ⬜ |
| 14.3 | Audyt WCAG 2.1 AA | ⬜ |
| 14.4 | Optymalizacja SEO | ⬜ |

---

### Faza 15: Finalizacja
**Status:** ⬜ Do zrobienia

| Krok | Opis | Status |
|------|------|--------|
| 15.1 | Dokumentacja API (OpenAPI/Swagger) | ⬜ |
| 15.2 | Instrukcje deployment do GCP Cloud Run | ⬜ |
| 15.3 | Przegląd bezpieczeństwa | ⬜ |
| 15.4 | Finalne testy integracyjne | ⬜ |

---

## Struktura katalogów

```
/Users/maciej/repo-coopilot/
├── estimate/
│   ├── REQUIREMENTS.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── requirements.txt
├── estimate-backend/
│   ├── src/main/java/com/estimate/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── api/
│   ├── src/test/
│   ├── Dockerfile
│   ├── pom.xml
│   └── README.md
└── estimate-ui/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   └── i18n/
    ├── Dockerfile
    ├── package.json
    └── README.md
```

---

## Modele danych

### User
```json
{
  "id": "string",
  "email": "string",
  "passwordHash": "string",
  "role": "USER | ADMIN",
  "companyName": "string?",
  "phone": "string?",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Work
```json
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "unit": "string (m2, mb, szt, etc.)",
  "materials": [
    {
      "name": "string",
      "unit": "string (l, kg, m, etc.)",
      "consumptionPerWorkUnit": "number"
    }
  ],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### RenovationTemplate
```json
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "workIds": ["string"],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Estimate
```json
{
  "id": "string",
  "userId": "string",
  "investorName": "string",
  "investorAddress": "string",
  "templateIds": ["string"],
  "works": [
    {
      "workId": "string",
      "quantity": "number",
      "laborPrice": "number",
      "materialPrices": [
        {
          "materialName": "string",
          "pricePerUnit": "number"
        }
      ]
    }
  ],
  "materialDiscount": "number (0-100)",
  "laborDiscount": "number (0-100)",
  "notes": "string?",
  "validUntil": "date?",
  "startDate": "date?",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## Endpointy API

### Autentykacja
- `POST /api/auth/register` — rejestracja
- `POST /api/auth/login` — logowanie (zwraca JWT)
- `POST /api/auth/demo` — logowanie demo

### Użytkownicy
- `GET /api/users/me` — dane zalogowanego użytkownika
- `PUT /api/users/me` — aktualizacja profilu (nazwa firmy, telefon, email)
- `PUT /api/users/me/password` — zmiana hasła
- `DELETE /api/users/me` — usunięcie konta

### Prace
- `GET /api/works` — lista prac użytkownika
- `GET /api/works/{id}` — szczegóły pracy
- `POST /api/works` — tworzenie pracy
- `PUT /api/works/{id}` — edycja pracy
- `DELETE /api/works/{id}` — usunięcie pracy

### Szablony
- `GET /api/templates` — lista szablonów
- `GET /api/templates/{id}` — szczegóły szablonu
- `POST /api/templates` — tworzenie szablonu
- `PUT /api/templates/{id}` — edycja szablonu
- `DELETE /api/templates/{id}` — usunięcie szablonu

### Kosztorysy
- `GET /api/estimates` — lista kosztorysów
- `GET /api/estimates/{id}` — szczegóły kosztorysu
- `POST /api/estimates` — tworzenie kosztorysu
- `PUT /api/estimates/{id}` — edycja kosztorysu
- `DELETE /api/estimates/{id}` — usunięcie kosztorysu
- `GET /api/estimates/{id}/pdf?detail=full|basic` — generowanie PDF

### Admin
- `GET /api/admin/users` — lista użytkowników
- `DELETE /api/admin/users/{id}` — usunięcie użytkownika
- `GET /api/admin/estimates` — wszystkie kosztorysy
- `GET /api/admin/works` — wszystkie prace
- `GET /api/admin/templates` — wszystkie szablony

---

## Checkpointy weryfikacji

Po każdej fazie należy:
1. Uruchomić testy jednostkowe/integracyjne
2. Uruchomić aplikację lokalnie
3. Sprawdzić podstawowe funkcjonalności
4. Zaktualizować status w tym pliku

### Komendy weryfikacyjne

**Backend:**
```bash
cd estimate-backend
./mvnw clean test           # testy
./mvnw spring-boot:run      # uruchomienie (port 8080)
```

**Frontend:**
```bash
cd estimate-ui
npm run test                # testy
npm run dev                 # uruchomienie (port 3000)
```

**Sprawdzenie działania:**
- Backend health: http://localhost:8080/actuator/health
- Frontend: http://localhost:3000

---

## Aktualny postęp

| Faza | Nazwa | Status |
|------|-------|--------|
| 0 | Infrastruktura | ✅ Zrobione |
| 1 | Backend — Fundament | ✅ Zrobione |
| 2 | Backend — Autentykacja | ✅ Zrobione |
| 3 | Backend — Prace | ✅ Zrobione |
| 4 | Backend — Szablony | ✅ Zrobione |
| 5 | Backend — Kosztorysy | ✅ Zrobione |
| 6 | Backend — PDF | ✅ Zrobione |
| 7 | Backend — Admin | ✅ Zrobione |
| 8 | Frontend — Fundament | ✅ Zrobione |
| 9 | Frontend — Autentykacja | ✅ Zrobione |
| 10 | Frontend — Prace | ✅ Zrobione |
| 11 | Frontend — Szablony | ✅ Zrobione |
| 12 | Frontend — Kosztorysy | ✅ Zrobione |
| 13 | Frontend — Admin | ✅ Zrobione |
| 14 | Testy E2E | ⬜ Do zrobienia |
| 15 | Finalizacja | ⬜ Do zrobienia |

---

## Notatki implementacyjne

- **Virtual Threads (Project Loom):** Spring Boot 3.2+ wspiera virtual threads, włączamy przez `spring.threads.virtual.enabled=true`
- **MongoDB in-memory:** Używamy `de.flapdoodle.embed.mongo` do testów i developmentu
- **Next.js SSR:** Używamy App Router z Server Components dla SEO i wydajności
- **Neumorphism:** Konfiguracja Tailwind z custom shadows i gradientami
- **i18n:** Polski jako domyślny, angielski jako dodatkowy
