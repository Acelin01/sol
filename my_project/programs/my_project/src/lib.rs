use anchor_lang::prelude::*;

declare_id!("HaPVZv6GAYyEfEF8HYKC8vhnkTAabJ3xdWXtVfAC8JBo");

#[program]
pub mod my_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
