module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany({},{$set:{createdAt:new Date()}})
    await db.collection('users').updateMany({},{$set:{updatedAt:new Date()}})
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db, client) {
    await db.collection('users').updateMany({},{$unset:{createdAt:""}})
    await db.collection('users').updateMany({},{$unset:{updatedAt:""}})
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
