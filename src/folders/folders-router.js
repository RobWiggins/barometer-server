'use strict';

const express = require('express');
const path = require('path');
const FoldersService = require('./folders-service');
const xss = require('xss');

const foldersRouter = express.Router();
const jsonBodyParser = express.json();

const serializeFolder = folder => ({
  id: folder.id,
  title: xss(folder.title),
});

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    FoldersService.getAllFolders(knexInstance)
      .then(response => res.json(response))
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    let folder_name = req.body.name;
    if (!folder_name) {
      return res.status(400).json({
        error: { message: 'Missing required "name" from body' },
      });
    }

    const newFolder = { folder_name };
    FoldersService.insertFolder(knexInstance, newFolder)
      .then(folder =>
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializeFolder(folder))
      )
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { name, folderId } = req.body;
    if (!name || !folderId) {
      return res.status(400).json({
        error: {
          message:
            'Request body must contain both a folder "name" and folderId"',
        },
      });
    }
    const folderToUpdate = { folder_name: name };
    FoldersService.updateFolder(
      req.app.get('db'),
      parseInt(folderId),
      folderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete(jsonBodyParser, (req, res, next) => {
    let id = req.body.folderId;
    FoldersService.deleteFolder(req.app.get('db'), parseInt(id))
      .then(() => res.status(204).end())
      .catch(next);
  });

module.exports = foldersRouter;