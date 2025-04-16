#![allow(clippy::result_large_err)]
use anchor_lang::prelude::*;
use anchor_lang::system_program::{create_account, CreateAccount};

declare_id!("HaPVZv6GAYyEfEF8HYKC8vhnkTAabJ3xdWXtVfAC8JBo");

#[program]
pub mod my_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn create_system_account(ctx: Context<CreateSystemAccount>) -> Result<()> {
        msg!("Creating system account for: {:?}", ctx.accounts.new_account.key());
        
        // Get the rent exemption amount
        let rent = Rent::get()?;
        let lamports = rent.minimum_balance(0);
        
        // Create the account via CPI to the system program
        create_account(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                CreateAccount {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.new_account.to_account_info(),
                },
            ),
            lamports,
            0,
            ctx.program_id,
        )?;
        
        msg!("System account created successfully");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct CreateSystemAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub new_account: Signer<'info>,
    pub system_program: Program<'info, System>,
}
