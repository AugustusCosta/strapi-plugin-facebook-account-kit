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
      return ctx.forbidden( 'Erro na validação de segurança' );


    // console.log( validationResult = await strapi.plugins[ 'facebook-account-kit' ].services );

    validationResult = await strapi.plugins[ 'facebook-account-kit' ].services.facebookaccountkit.validate( auth );

    if ( !validationResult ) return ctx.forbidden( 'Erro na validação do código com Facebook' );



    phone = await strapi.plugins[ 'facebook-account-kit' ].models.phone.findOne(
      validationResult
      // {
      //   countryPrefix: '55',
      //   nationalNumber: '85988424402',
      //   number: '+5585988424402',
      // }
    ).populate( 'user' );

    // if ( !phone || !phone.length ) return ctx.send( { phone: {} } );
    if ( !phone || !phone.user ) return ctx.send( { phone: validationResult } );


    // user = phone.user;
    user = await strapi.plugins[ 'users-permissions' ].models.user.findOne( phone.user )
      .populate( 'phone' )
      .populate( 'motorcycles' )
      .populate( 'address' )
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

    // console.log( "PARAMS" );
    // console.log( params );


    if ( !params || !params.phone ) return ctx.badData( 'Dados obrigatórios não enviados' );

    user = await strapi.plugins[ 'facebook-account-kit' ].services.facebookaccountkit.signup( params );
    if ( !user ) return ctx.badData( 'Não foi possível realizar o cadastro' );

    token = strapi.plugins[ 'users-permissions' ].services.jwt.issue( user, {} );

    return ctx.send( {
      user,
      token: token
    } );
  },
};
