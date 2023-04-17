<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckMoaStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-moa-status-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $partners = Partner::all();

        foreach ($partners as $partner) {
            $today = Carbon::today();
            $startDate = Carbon::createFromFormat('Y-m-d', $partner->start_date);
            $endDate = Carbon::createFromFormat('Y-m-d', $partner->end_date);

            if ($endDate->eq($today)) {
                // Send email for MOA expiration
                Mail::send('emails.notify_moaExpired', ['partner' => $partner], function ($message) use ($partner) {
                    $message->to($partner->email)->subject('MOA Expiration Notification');
                });
            } else if ($startDate->eq($today)) {
                // Send email for MOA start date
                Mail::send('emails.notify_moaStarted', ['partner' => $partner], function ($message) use ($partner) {
                    $message->to($partner->email)->subject('MOA Start Notification');
                });
            }
        }
    }
}
