'use strict';

/**
 * FacebookAccountKit.js controller
 *
 * @description: A set of functions called "actions" of the `facebook-account-kit` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  signin: async ctx =>
  {
    let validationResult, user, phone, token;


    const auth = ctx.request.body.auth;


    if ( strapi.plugins[ 'facebook-account-kit' ].config.accountKit.csrf !== auth.state )
      return ctx.forbidden( 'Security validation error' );

    validationResult = await strapi.plugins[ 'facebook-account-kit' ].services.facebookaccountkit.validate( auth );

    if ( !validationResult ) return ctx.forbidden( 'Facebook code validation error' );



    phone = await strapi.plugins[ 'facebook-account-kit' ].models.phone.findOne(
      validationResult
    ).populate( 'user' );

    if ( !phone || !phone.user ) return ctx.send( { phone: validationResult } );

    user = await strapi.plugins[ 'users-permissions' ].models.user.findOne( phone.user )
      .populate( 'phone' );


    if ( user.blocked ) return ctx.unauthorized( 'Blocked user' );

    token = strapi.plugins[ 'users-permissions' ].services.jwt.issue( user, {} );

    return ctx.send( {
      user,
      token: token
    } );

  },

  signup: async ctx =>
  {
    let user, token;
    const params = ctx.request.body.user;


    if ( !params || !params.phone ) return ctx.badData( 'Required data not sent' );

    user = await strapi.plugins[ 'facebook-account-kit' ].services.facebookaccountkit.signup( params );
    if ( !user ) return ctx.badData( 'Unable to register' );

    token = strapi.plugins[ 'users-permissions' ].services.jwt.issue( user, {} );

    return ctx.send( {
      user,
      token: token
    } );
  },
};
