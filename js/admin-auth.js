const ENDPOINT='https://qucyegqtgdnigcmpfrlw.supabase.co/functions/v1/archive404-auth';
const PUBLIC_KEY='sb_publishable_AoVFnTmsCIcC0_a9zvF7OQ_CKqpCTq0';
export const ADMIN_HOLD_MS=7000;
export function adminRoute(hash){const value=String(hash).replace(/^#/,'');const token=value.startsWith('setup=')?value.slice(6):'';return /^[a-f0-9]{64}$/.test(token)?{view:'admin',setupToken:token}:{view:value||'menu',setupToken:''};}

// Tokens live only in this instance, never in backups or browser storage.
export class AdminAuth {
  #session=null;
  #lastUsed=0;
  constructor(fetcher=(url,options)=>globalThis.fetch(url,options),clock=Date.now){this.fetcher=fetcher;this.clock=clock;}
  active(){return !!this.#session&&this.#session.expires_at*1000>this.clock()&&this.clock()-this.#lastUsed<15*60*1000;}
  async request(body,token){
    const response=await this.fetcher(ENDPOINT,{method:'POST',cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json',apikey:PUBLIC_KEY,...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||'Sign-in is unavailable. Please retry online.');
    return data;
  }
  async login(username,password,setupToken){
    this.#session=null;
    const data=await this.request({action:setupToken?'setup':'login',username,password,...(setupToken?{setupToken}:{})});
    if(!data.access_token||!Number.isFinite(data.expires_at)||data.expires_at*1000<=this.clock())throw new Error('Sign-in returned an invalid session.');
    this.#session={access_token:data.access_token,expires_at:data.expires_at};this.#lastUsed=this.clock();
  }
  async validateSetup(token){const result=await this.request({action:'setup-check',setupToken:token});return result.valid===true;}
  async check(){
    if(!this.active()){this.#session=null;return false;}
    const session=this.#session;
    try{const data=await this.request({action:'check'},session.access_token);if(this.#session!==session||session.expires_at*1000<=this.clock())return false;if(data.authorized!==true)throw new Error('Admin access required');this.#lastUsed=this.clock();return true;}
    catch{this.#session=null;return false;}
  }
  async logout(){const token=this.#session?.access_token;this.#session=null;this.#lastUsed=0;if(token)await this.request({action:'logout'},token).catch(()=>{});}
}
