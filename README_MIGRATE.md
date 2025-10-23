Migration from Mongo JSON exports to Sequelize (MySQL)

1. Prepare exports
- Export your Mongo collections into JSON arrays and place them in a folder `mongo_exports/` at the project root. Files expected:
  - users.json
  - artists.json
  - events.json

2. Ensure database is running and env vars set
- Set DB env vars or rely on defaults in `config/database.js`:
  - DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_DIALECT
- Ensure `TOKEN_SECRET` env var is set when running the app if needed.

3. Run the migration script
```bash
# from project root
node scripts/migrate_from_mongo.js ./mongo_exports
```

Notes
- This script is intended for development data migration only. It doesn't dedupe or check for duplicates.
- It maps Mongo `_id` values internally to new Sequelize ids and associates events -> artists via `lineUp` arrays.
