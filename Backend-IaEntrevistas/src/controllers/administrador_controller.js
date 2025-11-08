import Administrador from "../models/Administrador.js"
import { sendMailToRegister } from "../helpers/sendMail.js"


const registro = async (req,res)=>{

    try {
        const {email,password} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const verificarEmailBDD = await Administrador.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        const nuevoAdministrador = new Administrador(req.body)
        nuevoAdministrador.password = await nuevoAdministrador.encryptPassword(password)
       
        const token = nuevoAdministrador.createToken()
        await sendMailToRegister(email,token)
        await nuevoAdministrador.save()
        res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }

}

const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params
        const administradorBDD = await Administrador.findOne({ token })
        if (!administradorBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })
        administradorBDD.token = null
        administradorBDD.confirmEmail = true
        await administradorBDD.save()
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })

    } catch (error) {
    console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

export {
    registro,
    confirmarMail
}
