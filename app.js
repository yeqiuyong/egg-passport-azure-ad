'use strict';

const debug = require('debug')('egg-passport-azure-ad');
const assert = require('assert');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

const OAUTH_SCOPES = 'profile offline_access user.read calendars.read';
const OAUTH_AUTHORITY = 'https://login.microsoftonline.com/common';
const OAUTH_ID_METADATA = '/v2.0/.well-known/openid-configuration';
const OAUTH_AUTHORIZE_ENDPOINT = '/oauth2/v2.0/authorize';
const OAUTH_TOKEN_ENDPOINT = '/oauth2/v2.0/token';


module.exports = app => {
  const config = app.config.passportAzureAd;
  config.passReqToCallback = true;
  assert(config.key, '[egg-passport-azure-ad] config.passportAzureAd.key required');
  assert(config.secret, '[egg-passport-azure-ad] config.passportAzureAd.secret required');
  config.clientID = config.key;
  config.clientSecret = config.secret;



  // 处理用户信息这个呢，就是做验证用的，比如去数据库里面查用户是否存在，如果存在处理user返回，会进入下一个函数
  // app.passport.verify(async (ctx, user) => {
  //   return user;
  // });
  // 这个接受上一个函数给予的user，保存到session用的，总不能每次用户操作都查数据库吧。由于要进session的，所以这里面保存的字段要精简。
  app.passport.serializeUser(async (ctx, user) => {
    return user.id;
  });
  // 这个函数是从session反查到用户用的。eggjs自动逻辑在前端写入cookie字段。每次访问会带上这个cookie。服务器根据这个cookie判断是谁，然后根据deserializeUser找到用户。
  app.passport.deserializeUser(async (ctx, user) => {
    return user;
  });

  // must require `req` params
  app.passport.use('azuread', new OIDCStrategy({
      identityMetadata: `${OAUTH_AUTHORITY}${OAUTH_ID_METADATA}`,
      clientID: config.key,
      responseType: 'code id_token',
      responseMode: 'form_post',
      redirectUrl: config.callbackURL,
      allowHttpForRedirectUrl: true,
      clientSecret: config.secret,
      validateIssuer: false,
      passReqToCallback: true,
      scope: OAUTH_SCOPES.split(' ')
    },
    async function (req, iss, sub, profile, accessToken, refreshToken, params, done) {
      if (!profile.oid) {
        return done(new Error("No OID found in user profile."), null);
      }

      try {

        // format user
        const user = {
          provider: 'azure-ad',
          id: profile.oid,
          tid: profile._json && profile._json.tid,
          name: profile.name,
          displayName: profile.displayName,
          email: profile.email,
          accessToken,
          refreshToken,
          params,
          profile,
        };
        //req.ctx.response.status = 200;

        await app.passport.doVerify(req, user, done);

      } catch (err) {
        done(err, null);
      }

    }
  ));

};