'use strict';

/**
 * StrapiPluginFacebookAccountKit.js controller
 *
 * @description: A set of functions called "actions" of the `strapi-plugin-facebook-account-kit` plugin.
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

    if ( strapi.plugins['strapi-plugin-facebook-account-kit'].config.accountKit.csrf !== auth.state )
      return ctx.forbidden( 'Erro na validação de segurança' );



    validationResult = await strapi.plugins['strapi-plugin-facebook-account-kit'].services.strapiPluginFacebookAccountKit.validate( auth );

    if ( !validationResult ) return ctx.forbidden( 'Erro na validação do código com Facebook' );



    phone = await strapi.plugins['strapi-plugin-facebook-account-kit'].services.phone.find(
      validationResult
      // {
      //   countryPrefix: '55',
      //   nationalNumber: '85988424402',
      //   number: '+5585988424402',
      // }
    );

    if ( !phone || !phone.length ) return ctx.send( { phone: validationResult } );


    user = await strapi.plugins[ 'users-permissions' ].models.user.findOne( phone[ 0 ].user )
      // .populate( 'phone' )
      // .populate( 'motorcycles' )
      // .populate( 'address' )
      ;


    if ( user.blocked ) return ctx.unauthorized( 'Erro teste' );

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


    if ( !params || !params.phone ) return ctx.badData( 'Dados obrigatórios não enviados' );
    user = await strapi.plugins['strapi-plugin-facebook-account-kit'].services.strapiPluginFacebookAccountKit.signup( params );
    if ( !user ) return ctx.badData( 'Não foi possível realizar o cadastro' );

    token = strapi.plugins[ 'users-permissions' ].services.jwt.issue( user, {} );

    return ctx.send( {
      user,
      token: token
    } );
  },
};
