'use strict';

/**
 * product-line service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::product-line.product-line');
