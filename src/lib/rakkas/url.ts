
//  recieve a url , save its pathname and serch params into the redirect search param
export function redirectURLWithSechParams(url:URL,to:string){
const redirect_to = to + url.search
url.searchParams.set("redirect",redirect_to)
return url
}
