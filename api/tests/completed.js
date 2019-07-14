/**
 * COMPLETED ROUTE TESTS ARE 
 *      
 *   Routes
 *     |__ Auth 
 *     |    |__login [working][LocalGuard]
 *     |    |__pass  [working] [RegisterGuard] //Sets Password and flags Signed to true
 *     |
 *     |__ User     
 *     |    |__ get  S  [Working][TokenGuard]
 *     |    |__ get  P  [Working][TokenGuard] 
 *     |    |__ post D  [Working][TokenGuard,RoleGuard] // admin can generate other admins
 *     |    |__ put  S  [Working][TokenGuard,UserGuard] // modifies users
 *     |    |__ del  S  [Usable?][Working][TokenGuard, UserGuard] //bans users
 *     |    
 *     |__ Team  
 *     |    |__ get     [ Working] without Guards 
 *     |    |__ get     [ Working] without Guards 
 *     |    |__ post    [ Working] without Guards 
 *     |    |__ put     [ Working] without Guards 
 *     |    |__ delete  [ Working] without Guards 
 *     |    
 * 
 */