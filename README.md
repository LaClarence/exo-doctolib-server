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
- Méthode: **GET**
- Paramètres query : date=2019-01-31"

### Exemple

- **GET**: http://localhost:3000/visits?date=2019-01-31

```json
{
  "date": "2019-01-31",
  "slots": {
    "1000": { "isAvailable": true },
    "1030": { "isAvailable": true },
    "1100": { "isAvailable": true },
    "1130": { "isAvailable": true },
    "1400": { "isAvailable": true },
    "1430": { "isAvailable": true },
    "1500": { "isAvailable": true },
    "1530": { "isAvailable": true },
    "1600": { "isAvailable": true },
    "1630": { "isAvailable": true },
    "1700": { "isAvailable": true },
    "1730": { "isAvailable": true }
  }
}
```

## Service Web pour réserver

- URL: http://localhost:3000/visits
- Méthode: **POST**
- Paramètres body:

```json
{
  "date": "2019-01-31",
  "slot": "1500",
  "name": "John"
}
```

- Réponse: Statut 200

```json
{
  "message": "Successfuly booked"
}
```

Si le service pour obtenir les disponibilités est appelé de nouveau http://localhost:3000/visits?date=2019-01-31, nous aurons maintenant la réponse suivante (statut 200) :

```json
{
  "date": "2019-01-31",
  "slots": {
    "1000": { "isAvailable": true },
    "1030": { "isAvailable": true },
    "1100": { "isAvailable": true },
    "1130": { "isAvailable": true },
    "1400": { "isAvailable": true },
    "1430": { "isAvailable": true },
    "1500": { "isAvailable": false, "name": "John" },
    "1530": { "isAvailable": true },
    "1600": { "isAvailable": true },
    "1630": { "isAvailable": true },
    "1700": { "isAvailable": true },
    "1730": { "isAvailable": true }
  }
}
```

Et si jamais vous tentez de nouveau de réserver le même créneau, le serveur devra refuser votre demande (statut 400) :

```json
{
  "error": {
    "message": "Slot already booked"
  }
}
```
