'use strict';

const FoldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('folders');
  },
  insertFolder(knex, folder) {
    return knex
      .insert(folder)
      .into('folders')
      .returning('*')
      .then(rows => rows[0]);
  },
  getFolderById(knex, folderId) {
    return knex('folders')
      .select('*')
      .where('id', folderId)
      .first();
  },
  deleteFolder(knex, folderId) {
    return knex('folders')
      .where('id', folderId)
      .delete();
  },
  updateFolder(knex, folderId, newFolder) {
    return knex('folders')
      .where('id', folderId)
      .update(newFolder);
  },
};

module.exports = FoldersService;
