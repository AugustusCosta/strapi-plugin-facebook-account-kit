'use strict';

/**
 * Phone.js controller
 *
 * @description: A set of functions called "actions" for managing `Phone`.
 */

module.exports = {

  /**
   * Retrieve phone records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.plugins[ 'facebook-account-kit' ].services.phone.search(ctx.query);
    } else {
      return strapi.plugins[ 'facebook-account-kit' ].services.phone.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a phone record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.plugins[ 'facebook-account-kit' ].services.phone.fetch(ctx.params);
  },

  /**
   * Count phone records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.plugins[ 'facebook-account-kit' ].services.phone.count(ctx.query);
  },

  /**
   * Create a/an phone record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.plugins[ 'facebook-account-kit' ].services.phone.add(ctx.request.body);
  },

  /**
   * Update a/an phone record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.plugins[ 'facebook-account-kit' ].services.phone.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an phone record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.plugins[ 'facebook-account-kit' ].services.phone.remove(ctx.params);
  }
};
