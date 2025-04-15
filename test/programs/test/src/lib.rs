use anchor_lang::prelude::*;

declare_id!("FeiNMM9u1p1nWbjsBqNFoEvEfXkngxebMX3aA5GMvePN");

#[program]
pub mod test {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
