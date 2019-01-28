# Le Reacteur - Exo Doctolib serveur

## Prerequisites

- npm must be available.
- node.js must be installed.

## Quick Start

```bash
npm install
```

## Service Web pour obtenir les disponibilités

- URL: http://localhost:3000/visits
- Méthode: POST
- Paramètres :
  - "date" (exemple: "2019-01-31")
  - "slot" (exemple: "1500" pour 3 heures de l'après-midi)
  - "name" (exemple: "John")

## Service Web pour réserver

- URL: http://localhost:3000/visits
- Méthode: POST
- Paramètres :
  - "date" (exemple: "2019-01-31")
  - "slot" (exemple: "1500" pour 3 heures de l'après-midi)
  - "name" (exemple: "John")

```json
{
  "date": "2019-01-31",
  "slot": "1500",
  "name": "John"
}
```
