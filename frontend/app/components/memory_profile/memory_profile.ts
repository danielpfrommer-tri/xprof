import {Component, inject, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Throbber} from 'org_xprof/frontend/app/common/classes/throbber';
import {MemoryProfileProto} from 'org_xprof/frontend/app/common/interfaces/data_table';
import {NavigationEvent} from 'org_xprof/frontend/app/common/interfaces/navigation_event';
import {MemoryProfileBase} from 'org_xprof/frontend/app/components/memory_profile/memory_profile_base';
import {DATA_SERVICE_INTERFACE_TOKEN} from 'org_xprof/frontend/app/services/data_service_v2/data_service_v2_interface';
import {setCurrentToolStateAction} from 'org_xprof/frontend/app/store/actions';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/** A Memory Profile component. */
@Component({
  standalone: false,
  selector: 'memory-profile',
  templateUrl: './memory_profile.ng.html',
  styleUrls: ['./memory_profile.css'],
})
export class MemoryProfile extends MemoryProfileBase implements OnDestroy {
  tool = 'memory_profile';
  /** Handles on-destroy Subject, used to unsubscribe. */
  private readonly destroyed = new ReplaySubject<void>(1);
  private readonly throbber = new Throbber(this.tool);
  private readonly dataService = inject(DATA_SERVICE_INTERFACE_TOKEN);

  sessionId = '';
  host = '';
  hostIds: number[] = [];
  selectedHostId = 0;
  hasIncompleteSteps = false;
  loading = false;

  constructor(
      route: ActivatedRoute,
      private readonly store: Store<{}>,
  ) {
    super();
    route.params.pipe(takeUntil(this.destroyed)).subscribe((params) => {
      params = params || {};
      this.sessionId = params['sessionId'] || '';
      this.selectedHostId = params['host_id'] || 0;
      this.update(params as NavigationEvent);
    });
    this.store.dispatch(
        setCurrentToolStateAction({currentTool: 'memory_profile'}),
    );
  }

  update(event?: NavigationEvent) {
    this.sessionId = event?.run || this.sessionId;
    this.tool = event?.tag || this.tool;
    this.host = event?.host || this.host;
    this.loading = true;
    this.throbber.start();

    this.dataService
        .getData(
            this.sessionId,
            this.tool,
            this.host,
            new Map([['host_id', this.selectedHostId.toString()]]),
            )
        .pipe(takeUntil(this.destroyed))
        .subscribe((data) => {
          this.throbber.stop();
          this.loading = false;
          this.parseData(data as MemoryProfileProto | null);
        });
  }

  override parseData(data: MemoryProfileProto|null) {
    super.parseData(data);

    const hostIds = [];
    if (this.data) {
      const numHosts = this.data.numHosts!;
      for (let i = 0; i < numHosts; ++i) {
        hostIds.push(i);
      }
    }
    this.hostIds = hostIds;

    let hasIncompleteSteps = false;
    if (this.data) {
      const snapshots =
          this.data.memoryProfilePerAllocator![this.selectedMemoryId]
              .sampledTimelineSnapshots!;
      if (snapshots) {
        hasIncompleteSteps = snapshots.length === 0 ||
            Number(snapshots[snapshots.length - 1].activityMetadata!.stepId!) <
                1;
      }
    }
    this.hasIncompleteSteps = hasIncompleteSteps;
  }

  ngOnDestroy() {
    // Unsubscribes all pending subscriptions.
    this.destroyed.next();
    this.destroyed.complete();
  }
}
