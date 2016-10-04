'use strict';
const path = require('path');
const os = require('os');
const fs = require('fs');
const helper = require('./helper');

const CONTROLLER_TEMPLATE = path.join(__dirname, 'templates', 'Controller.js');
const SERVICE_TEMPLATE = path.join(__dirname, 'templates', 'Service.js');
const MAPPER_TEMPLATE = path.join(__dirname, 'templates', 'Mapper.js');
const MODEL_TEMPLATE = path.join(__dirname, 'templates', 'Model.js');

const SERVICE_REQUIRE = "\n"+'const %SERVICE%Service = require(\'%SERVICE_PATH%\');';
const SERVICE_INIT = "\n" + '    this.service = new %SERVICE%Service(di);';

const MAPPER_REQUIRE = "\n" + 'const %MAPPER%Mapper = require(\'%MAPPER_PATH%\');';
const MAPPER_INIT = "\n" + '    this.mapper = new %MAPPER%Mapper(di);';

class Generator {
    constructor(module, controller, service, mapper, mapperExtends, model){
      this.module = module;
      this.controller = controller;
      this.service = service;
      this.mapper = mapper;
      this.mapperExtends = mapperExtends;
      this.model = model;
    }

    setConfig(config){
      this.config = config;
      return this;
    }

    start(){
      return new Promise((resolve, reject) => {
          this.createModule()
              .createController()
              .createService()
              .createMapper()
              .createModel();

          resolve(true);
      });
    }

    createModule(module){
      if(module){

      }
      return this;
    }

    createController(){
      var template = fs.readFileSync(CONTROLLER_TEMPLATE).toString().split('%CONTROLLER%').join(this.controller);
      var serviceRequire = '';
      var serviceInit = '';

      if(this.service){
        var servicePath = '../services/' + this.getServiceFileName() + '.service.js';
        serviceRequire = SERVICE_REQUIRE.replace('%SERVICE%', this.service).replace('%SERVICE_PATH%', servicePath);
        serviceInit = SERVICE_INIT.replace('%SERVICE%', this.service);
      }
      template = template.replace('%SERVICE_REQUIRE%', serviceRequire).replace('%SERVICE_INIT%', serviceInit);

      this.controllerFileName = helper.camelCaseToDashes(this.controller);
      fs.writeFileSync(path.join(this.config.path, 'controllers', this.controllerFileName + '.controller.js'), template);
      return this;
    }

    createService(){
      if(this.service){
        var template = fs.readFileSync(SERVICE_TEMPLATE).toString().split('%SERVICE%').join(this.service);
        var mapperRequire = '';
        var mapperInit = '';

        if(this.mapper){
          var mapperPath = '../mappers/' + this.getMapperFileName() + '.mapper.js';
          mapperRequire = MAPPER_REQUIRE.replace('%MAPPER%', this.mapper).replace('%MAPPER_PATH%', mapperPath);
          mapperInit = MAPPER_INIT.replace('%MAPPER%', this.mapper);
        }
        template = template.replace('%MAPPER_REQUIRE%', mapperRequire).replace('%MAPPER_INIT%', mapperInit);
        fs.writeFileSync(path.join(this.config.path, 'services', this.getServiceFileName() + '.service.js'), template);
      }
      return this;
    }

    createMapper(){
      if(this.mapper){
        var template = fs.readFileSync(MAPPER_TEMPLATE).toString().split('%MAPPER%').join(this.mapper);
        var mapperPath = '../mappers/' + this.getMapperFileName() + '.mapper.js';

        template = template.split('%MAPPER_EXTENDS%').join(this.mapperExtends + 'Mapper');
        template = template.split('%MODEL%').join(this.mapper);

        var modelPath = '../models/' + this.getMapperFileName() + '.js';
        template = template.replace('%MODEL_PATH%', modelPath);

        template = template.replace('%MODEL_REPOSITORY%', helper.firstLower(this.controller));
        template = template.replace('%MODEL_CONNECTION%', this.mapperExtends.toLowerCase());

        fs.writeFileSync(path.join(this.config.path, 'mappers', this.getMapperFileName() + '.mapper.js'), template);
      }
      return this;
    }
    createModel(){
      if(this.mapper){
        var template = fs.readFileSync(MODEL_TEMPLATE).toString().split('%MODEL%').join(this.mapper);
        var modelConstructor = [];
        if(this.model){
          var fields = this.model.split(',');
          for( var i in fields){
            var field = fields[i].trim();
            modelConstructor.push('    this.' + field + ' = data.' + field );
          }
        }
        template = template.replace('%MODEL_CONSTRUCTOR%', modelConstructor.join("\n"));
        fs.writeFileSync(path.join(this.config.path, 'models', this.getMapperFileName() + '.js'), template);
      }
      return this;
    }

    getServiceFileName(){
      if(this.serviceFileName){
        return this.serviceFileName;
      }
      return helper.camelCaseToDashes(this.service);
    }
    getMapperFileName(){
      if(this.mapperFileName){
        return this.mapperFileName;
      }
      return helper.camelCaseToDashes(this.mapper);
    }
}

module.exports = Generator;
