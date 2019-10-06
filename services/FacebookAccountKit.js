'use strict';

const axios = require( 'axios' );

/**
 * FacebookAccountKit.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {

    validate: async auth =>
    {
        let result;
        let validateCodeUrl = strapi.plugins[ 'facebook-account-kit' ].config.accountKit.validateCodeUrl;
        let validateTokenUrl = strapi.plugins[ 'facebook-account-kit' ].config.accountKit.validateTokenUrl;
        let appId = strapi.plugins[ 'facebook-account-kit' ].config.accountKit.appId;
        let appSecret = strapi.plugins[ 'facebook-account-kit' ].config.accountKit.appSecret;

        validateCodeUrl += "&code=" + auth.code;
        validateCodeUrl += "&access_token=AA|" + appId + "|" + appSecret;


        /* return example:
        {
          "id": "731784860602781",
          "access_token": "EMAWfBvwYpQaNSanagCjEllRwgq5pQm2ShqpOZCUZB8LEpKftsvZAGdCEMZAna2PdAU2hUoXB3HwlnzEHqZBZAlZCZAfkIw6UKU8wadUeogjActba0CbGKIWd9oUdMZACyZBsrScm85NeRdCy8HZAPSjqNOeOBCufh4ZA1zfweFwV13ZA6KFjeZC0Vmd4Lr77YKoyVSvCEQZD",
          "token_refresh_interval_sec": 2592000
        }
      */
        result = await axios.get( validateCodeUrl )
            .then( res =>
            {
                return res.data;
            } )
            .catch( err =>
            {
                console.log( err.message );

                return null;
            } );


        if ( !result ) return null;



        /* return example:
        {
          "id": "731784860602781",
          "phone": {
              "number": "+5511973357095",
              "country_prefix": "55",
              "national_number": "11973357095"
          },
          "application": {
              "id": "390265671523337"
          }
        }
        */
        result = await axios.get( validateTokenUrl + result.access_token )
            .then( res =>
            {
                return res.data;
            } )
            .catch( err =>
            {
                console.log( err.message );

                return null;
            } );

        return result && result.phone ?
            {
                countryPrefix: result.phone.country_prefix,
                nationalNumber: result.phone.national_number,
                number: result.phone.number
            }
            : null;
    },

    signup: async params =>
    {
        let user, phone;

        try
        {
            phone = await strapi.plugins[ 'facebook-account-kit' ].models.phone.create( params.phone );
            
            user = await strapi.plugins[ 'users-permissions' ].services.user.add(
                {
                    ...params,
                    username: params.username ? params.username : params.name,
                    phone: phone.id
                } );
            return user;
        } catch ( error )
        {
            console.log( "ERRO CRIANDO" );
            console.log( error );
            try
            {
                if ( phone )
                    await strapi.plugins[ 'facebook-account-kit' ].models.phone.deleteOne( phone.id );
                if ( user )
                    await strapi.plugins[ 'users-permissions' ].services.user.remove( user );


            } catch ( error )
            {
                console.log( "ERRO REMOVENDO" );
                console.log( error );
            }
        }
        return null;
    }
};
