// Soroban Smart Contract for Escrow System
// This is a reference implementation for future deployment

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, symbol_short};

#[derive(Clone)]
#[contracttype]
pub enum JobStatus {
    Pending,
    Completed,
    Approved,
    Disputed,
    Resolved,
}

#[derive(Clone)]
#[contracttype]
pub struct Job {
    pub id: u64,
    pub client: Address,
    pub freelancer: Address,
    pub amount: i128,
    pub status: JobStatus,
    pub escrow_balance: i128,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Job(u64),
    JobCount,
    Dispute(u64),
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Create a new escrow job
    pub fn create_job(
        env: Env,
        client: Address,
        freelancer: Address,
        amount: i128,
    ) -> u64 {
        client.require_auth();
        
        // Get next job ID
        let job_count: u64 = env.storage().instance()
            .get(&DataKey::JobCount)
            .unwrap_or(0);
        
        let job_id = job_count + 1;
        
        // Create job
        let job = Job {
            id: job_id,
            client: client.clone(),
            freelancer,
            amount,
            status: JobStatus::Pending,
            escrow_balance: amount,
        };
        
        // Store job
        env.storage().instance().set(&DataKey::Job(job_id), &job);
        env.storage().instance().set(&DataKey::JobCount, &job_id);
        
        // Emit event
        env.events().publish((symbol_short!("job_created"), job_id), amount);
        
        job_id
    }
    
    /// Freelancer marks job as completed
    pub fn mark_completed(env: Env, job_id: u64, freelancer: Address) {
        freelancer.require_auth();
        
        let mut job: Job = env.storage().instance()
            .get(&DataKey::Job(job_id))
            .expect("Job not found");
        
        assert!(job.freelancer == freelancer, "Not authorized");
        assert!(matches!(job.status, JobStatus::Pending), "Invalid status");
        
        job.status = JobStatus::Completed;
        env.storage().instance().set(&DataKey::Job(job_id), &job);
        
        env.events().publish((symbol_short!("job_completed"), job_id), ());
    }
    
    /// Client approves and releases funds
    pub fn approve_job(env: Env, job_id: u64, client: Address) {
        client.require_auth();
        
        let mut job: Job = env.storage().instance()
            .get(&DataKey::Job(job_id))
            .expect("Job not found");
        
        assert!(job.client == client, "Not authorized");
        assert!(matches!(job.status, JobStatus::Completed), "Job not completed");
        
        job.status = JobStatus::Approved;
        
        // Transfer funds to freelancer
        // In production, this would use token transfer
        job.escrow_balance = 0;
        
        env.storage().instance().set(&DataKey::Job(job_id), &job);
        
        env.events().publish(
            (symbol_short!("job_approved"), job_id),
            job.amount
        );
    }
    
    /// Raise a dispute
    pub fn raise_dispute(env: Env, job_id: u64, caller: Address) {
        caller.require_auth();
        
        let mut job: Job = env.storage().instance()
            .get(&DataKey::Job(job_id))
            .expect("Job not found");
        
        assert!(
            job.client == caller || job.freelancer == caller,
            "Not authorized"
        );
        assert!(
            !matches!(job.status, JobStatus::Approved | JobStatus::Resolved),
            "Cannot dispute"
        );
        
        job.status = JobStatus::Disputed;
        env.storage().instance().set(&DataKey::Job(job_id), &job);
        
        env.events().publish((symbol_short!("dispute_raised"), job_id), ());
    }
    
    /// Arbitrator resolves dispute
    pub fn resolve_dispute(
        env: Env,
        job_id: u64,
        arbitrator: Address,
        winner: bool, // true = client, false = freelancer
    ) {
        arbitrator.require_auth();
        
        let mut job: Job = env.storage().instance()
            .get(&DataKey::Job(job_id))
            .expect("Job not found");
        
        assert!(matches!(job.status, JobStatus::Disputed), "Not disputed");
        
        job.status = JobStatus::Resolved;
        
        // Transfer funds to winner
        let recipient = if winner { job.client.clone() } else { job.freelancer.clone() };
        job.escrow_balance = 0;
        
        env.storage().instance().set(&DataKey::Job(job_id), &job);
        
        env.events().publish(
            (symbol_short!("dispute_resolved"), job_id),
            winner
        );
    }
    
    /// Get job details
    pub fn get_job(env: Env, job_id: u64) -> Job {
        env.storage().instance()
            .get(&DataKey::Job(job_id))
            .expect("Job not found")
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_create_job() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EscrowContract);
        let client = Address::generate(&env);
        let freelancer = Address::generate(&env);
        
        let client = EscrowContractClient::new(&env, &contract_id);
        
        let job_id = client.create_job(&client, &freelancer, &1000);
        assert_eq!(job_id, 1);
        
        let job = client.get_job(&job_id);
        assert_eq!(job.amount, 1000);
    }
    
    #[test]
    fn test_job_workflow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EscrowContract);
        let client_addr = Address::generate(&env);
        let freelancer_addr = Address::generate(&env);
        
        let client = EscrowContractClient::new(&env, &contract_id);
        
        // Create job
        let job_id = client.create_job(&client_addr, &freelancer_addr, &1000);
        
        // Mark completed
        client.mark_completed(&job_id, &freelancer_addr);
        let job = client.get_job(&job_id);
        assert!(matches!(job.status, JobStatus::Completed));
        
        // Approve
        client.approve_job(&job_id, &client_addr);
        let job = client.get_job(&job_id);
        assert!(matches!(job.status, JobStatus::Approved));
        assert_eq!(job.escrow_balance, 0);
    }
}
