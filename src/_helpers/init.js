function init(user)  {
    if(!user) {
        return null
    }
    const impersonatedJson = localStorage.getItem('customer_tree_'+user.username+'_selected');
    let impersonated = null
    if(impersonatedJson) {
        impersonated = JSON.parse(impersonatedJson)
        return impersonated
    } else {
        return {name: null, username: null}
    }
}
export {init}
