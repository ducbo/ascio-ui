function init(user)  {
    if(!user) {
        return null
    }
    const impersonatedJson = localStorage.getItem('customer_tree_'+user.username+'_selected');
    let impersonated = null
    if(impersonatedJson) {
        impersonated = JSON.parse(impersonatedJson)
        if(impersonated instanceof Object) {
            return impersonated
        } else {
            return {username : impersonated, name: impersonated}
        }
    } else {
        return {name: null, username: null}
    }
}
export {init}
