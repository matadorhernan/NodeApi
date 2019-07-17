/**
 * COMPLETED ROUTE TESTS ARE 
 *      
 *   Routes
 *     |__ Auth......[Tested]
 *     |    |__login [working][LocalGuard]
 *     |    |__pass  [working] [RegisterGuard] //Sets Password and flags Signed to true
 *     |
 *     |__ User.........[Tested]     
 *     |    |__ get  S  [Working][TokenGuard]
 *     |    |__ get  P  [Working][TokenGuard] 
 *     |    |__ post D  [Working][TokenGuard,RoleGuard] // admin can generate other admins
 *     |    |__ put  S  [Working][TokenGuard,UserGuard] // modifies users
 *     |    |__ del  S  [Working,Usable??][TokenGuard,UserGuard] //bans users
 *     |    
 *     |__ Team.........[Tested]  
 *     |    |__ get  S  [Working][TokenGuard]
 *     |    |__ get  P  [Working][TokenGuard]
 *     |    |__ post D  [Working][TokenGuard,RoleGuard]
 *     |    |__ put  S  [Working][TokenGuard,RoleGuard]
 *     |    
 *     |__ Tournament...[Tested]  
 *     |    |__ get  S  [Working][TokenGuard]
 *     |    |__ get  P  [Working][TokenGuard]
 *     |    |__ post D  [Working][TokenGuard,RoleGuard]
 *     |    |__ put  S  [Working][TokenGuard,RoleGuard]
 *     |    
 *     |__ Match........[Tested]  
 *     |    |__ get  S  [Working][TokenGuard]
 *     |    |__ get  P  [Working][TokenGuard]
 *     |    |__ post D  [Working][TokenGuard,RoleGuard] //KnockOut not working Properly
 *     |    |__ put  S  [Working][TokenGuard,RoleGuard]
 *     |    
 */

const KnockOutUtil = require('../utils/knockout.util')

let bs = new KnockOutUtil()
console.log(bs.generateKnockOut([{_id:1},{_id:2},{_id:3},{_id:4},{_id:5},{_id:6},{_id:7}], 'ggsgs'));