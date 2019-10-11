'use strict';

const _ = require( 'lodash' );

/**
 * `Phone` service.
 */

module.exports = {
  /**
 * Promise to fetch all phones.
 *
 * @return {Promise}
 */

  fetchAll: ( params, populate ) =>
  {
    return strapi.query( 'phone', 'facebook-account-kit' ).find( params, populate );
  },

  /**
   * Promise to fetch a/an phone.
   *
   * @return {Promise}
   */

  fetch: ( params ) =>
  {
    return strapi.query( 'phone', 'facebook-account-kit' ).findOne( _.pick( params, [ '_id', 'id' ] ) );
  },

  /**
   * Promise to count phones.
   *
   * @return {Promise}
   */

  count: ( params ) =>
  {
    return strapi.query( 'phoneto', 'facebook-account-kit' ).find( params ).count();
  },

  /**
   * Promise to add a/an phone.
   *
   * @return {Promise}
   */

  add: async ( values ) =>
  {
    // Extract values related to relational data.
    return strapi.query( 'phone', 'facebook-account-kit' ).create( values );
  },

  /**
   * Promise to edit a/an phone.
   *
   * @return {Promise}
   */

  edit: async ( params, values ) =>
  {
    return strapi.query( 'phone', 'facebook-account-kit' ).update( _.assign( params, values ) );
  },

  /**
   * Promise to remove a/an phone.
   *
   * @return {Promise}
   */

  remove: async params =>
  {
    return strapi.query( 'phone', 'facebook-account-kit' ).delete( params );
  },

  removeAll: async ( params, query ) =>
  {

    // TODO remove this logic when we develop plugins' dependencies
    const primaryKey = strapi.query( 'phone', 'facebook-account-kit' ).primaryKey;
    const toRemove = Object.keys( query ).reduce( ( acc, curr ) =>
    {
      if ( curr !== 'source' )
      {
        return acc.concat( [ query[ curr ] ] );
      }

      return acc;
    }, [] );

    return strapi.query( 'phone', 'facebook-account-kit' ).deleteMany( {
      [ primaryKey ]: toRemove,
    } );
  },

  /**
   * Promise to search a/an phone.
   *
   * @return {Promise}
   */

  search: async ( params ) =>
  {
    return strapi.query( 'phone', 'facebook-account-kit' ).find( params );
  }
};
